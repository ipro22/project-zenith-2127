"""
Авторизация: телефон (SMS-код), email+пароль, регистрация, смена пароля, Yandex OAuth.
Публичные данные: истории (stories), цены на услуги.
"""
import json
import os
import random
import string
import hashlib
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.header import Header

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35950310_project_zenith_2127')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def gen_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=64))


def hash_password(password: str) -> str:
    salt = os.environ.get('JWT_SECRET', 'ipro_salt_2026')
    return hashlib.sha256((salt + password).encode()).hexdigest()


def resp(status, payload):
    return {'statusCode': status, 'headers': CORS, 'body': json.dumps(payload, ensure_ascii=False)}


def client_row_to_dict(row, phone=''):
    return {
        'id': row[0], 'phone': row[1] or phone, 'name': row[2], 'email': row[3],
        'bonus_balance': row[4] or 0, 'loyalty_level': row[5] or 'standard',
        'visits_count': row[6] or 0, 'total_spent': row[7] or 0,
        'yandex_login': row[8] if len(row) > 8 else None,
        'yandex_avatar_url': row[9] if len(row) > 9 else None,
        'has_password': bool(row[10]) if len(row) > 10 else False,
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    action = body.get('action') or params.get('action', '')
    headers = event.get('headers') or {}

    # ── Без БД ────────────────────────────────────────────────────────────────
    if action == 'livesklad_status':
        api_key = os.environ.get('LIVESKLAD_API_KEY', '')
        order_id = (body.get('order_id') or params.get('order_id') or '').strip()
        if not order_id:
            return resp(400, {'error': 'order_id required'})
        url = f"https://api.livesklad.com/v1/orders/{urllib.parse.quote(order_id)}"
        req = urllib.request.Request(url, headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode('utf-8'))
            return resp(200, {'ok': True, 'order': data})
        except urllib.error.HTTPError as e:
            return resp(e.code, {'error': f'LiveSklad {e.code}'})
        except Exception as e:
            return resp(500, {'error': str(e)})

    conn = get_conn()
    cur = conn.cursor()
    try:
        # ── Истории (публичные) ───────────────────────────────────────────────
        if action == 'get_stories':
            cur.execute(f"SELECT id, title, subtitle, image_url, link_url, link_label, gradient_from, gradient_to FROM {SCHEMA}.stories WHERE is_active=TRUE ORDER BY sort_order, id LIMIT 10")
            stories = [{'id': r[0], 'title': r[1], 'subtitle': r[2], 'image_url': r[3], 'link_url': r[4], 'link_label': r[5], 'gradient_from': r[6], 'gradient_to': r[7]} for r in cur.fetchall()]
            return resp(200, {'stories': stories})

        # ── Цены на услуги (публичные) ────────────────────────────────────────
        elif action == 'get_prices':
            brand = body.get('brand_slug') or params.get('brand_slug', '')
            model = body.get('model_slug') or params.get('model_slug', '')
            if brand and model:
                cur.execute(f"SELECT service_name, price_text, price_num FROM {SCHEMA}.service_prices WHERE brand_slug=%s AND model_slug=%s AND is_active=TRUE ORDER BY sort_order", (brand, model))
            elif brand:
                cur.execute(f"SELECT model_slug, model_name, service_name, price_text, price_num FROM {SCHEMA}.service_prices WHERE brand_slug=%s AND is_active=TRUE ORDER BY model_slug, sort_order", (brand,))
            else:
                cur.execute(f"SELECT brand_slug, model_slug, service_name, price_text, price_num FROM {SCHEMA}.service_prices WHERE is_active=TRUE ORDER BY brand_slug, model_slug, sort_order LIMIT 500")
            rows = cur.fetchall()
            return resp(200, {'prices': [list(r) for r in rows]})

        # ── Авторизация по телефону ───────────────────────────────────────────
        elif action == 'send_code':
            phone = body.get('phone', '').strip()
            if not phone:
                return resp(400, {'error': 'phone required'})
            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=10)
            cur.execute(f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)", (phone, code, expires))
            conn.commit()
            return resp(200, {'success': True, 'dev_code': code})

        elif action == 'verify_code':
            phone = body.get('phone', '').strip()
            code = body.get('code', '').strip()
            cur.execute(f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1", (phone, code))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный или просроченный код'})
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (row[0],))
            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password FROM {SCHEMA}.clients WHERE phone=%s", (phone,))
            client = cur.fetchone()
            if not client:
                cur.execute(f"INSERT INTO {SCHEMA}.clients (phone) VALUES (%s) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password", (phone,))
                client = cur.fetchone()
            token = gen_token()
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, datetime.now() + timedelta(days=30)))
            conn.commit()
            return resp(200, {'success': True, 'token': token, 'client': client_row_to_dict(client)})

        # ── Регистрация email+пароль ──────────────────────────────────────────
        elif action == 'register_password':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '').strip()
            name = body.get('name', '').strip()
            if not email or '@' not in email:
                return resp(400, {'error': 'Введите корректный email'})
            if len(password) < 6:
                return resp(400, {'error': 'Пароль должен быть не менее 6 символов'})
            cur.execute(f"SELECT id FROM {SCHEMA}.clients WHERE email=%s", (email,))
            if cur.fetchone():
                return resp(409, {'error': 'Email уже зарегистрирован'})
            pw_hash = hash_password(password)
            cur.execute(
                f"INSERT INTO {SCHEMA}.clients (phone, email, name, password_hash, has_password) VALUES (%s, %s, %s, %s, TRUE) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password",
                (email, email, name or None, pw_hash)
            )
            client = cur.fetchone()
            token = gen_token()
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, datetime.now() + timedelta(days=30)))
            conn.commit()
            return resp(200, {'success': True, 'token': token, 'client': client_row_to_dict(client)})

        # ── Вход email+пароль ─────────────────────────────────────────────────
        elif action == 'login_password':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '').strip()
            if not email or not password:
                return resp(400, {'error': 'Введите email и пароль'})
            pw_hash = hash_password(password)
            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password FROM {SCHEMA}.clients WHERE email=%s AND password_hash=%s", (email, pw_hash))
            client = cur.fetchone()
            if not client:
                return resp(401, {'error': 'Неверный email или пароль'})
            token = gen_token()
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, datetime.now() + timedelta(days=30)))
            conn.commit()
            return resp(200, {'success': True, 'token': token, 'client': client_row_to_dict(client)})

        # ── Смена пароля ──────────────────────────────────────────────────────
        elif action == 'change_password':
            auth_token = headers.get('X-Auth-Token', '')
            cur.execute(f"SELECT client_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()", (auth_token,))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'unauthorized'})
            cid = row[0]
            old_pw = body.get('old_password', '').strip()
            new_pw = body.get('new_password', '').strip()
            if len(new_pw) < 6:
                return resp(400, {'error': 'Пароль должен быть не менее 6 символов'})
            # Проверяем старый пароль (если уже есть пароль)
            cur.execute(f"SELECT has_password, password_hash FROM {SCHEMA}.clients WHERE id=%s", (cid,))
            c = cur.fetchone()
            if c and c[0]:  # has_password
                if hash_password(old_pw) != c[1]:
                    return resp(400, {'error': 'Неверный текущий пароль'})
            new_hash = hash_password(new_pw)
            cur.execute(f"UPDATE {SCHEMA}.clients SET password_hash=%s, has_password=TRUE, updated_at=NOW() WHERE id=%s", (new_hash, cid))
            conn.commit()
            return resp(200, {'success': True})

        # ── Сброс пароля (по email — отправляем код) ──────────────────────────
        elif action == 'reset_password_send':
            elif action == 'reset_password_send':
            email = body.get('email', '').strip().lower()
            cur.execute(f"SELECT id FROM {SCHEMA}.clients WHERE email=%s", (email,))
            if not cur.fetchone():
                return resp(404, {'error': 'Email не найден'})
            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=15)
            cur.execute(f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)", (email, code, expires))
            conn.commit()
            
            SMTP_SERVER = "smtp.yandex.ru"    
            SMTP_PORT = 465                                
            SMTP_USER = "ov@e1media.ru"      
            SMTP_PASSWORD = "krgqrexjkekurngq"
            
            mail_subject = "Восстановление пароля"
            mail_body = f"Ваш код для сброса пароля: {code}\nКод действует 15 минут."
            
            msg = MIMEText(mail_body, "plain", "utf-8")
            msg["Subject"] = Header(mail_subject, "utf-8")
            msg["From"] = SMTP_USER
            msg["To"] = email
            
            try:
                with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=8) as server:
                    server.login(SMTP_USER, SMTP_PASSWORD)
                    server.sendmail(SMTP_USER, [email], msg.as_string())
            except Exception as e:
                print(f"SMTP Email Send Error: {e}")
            return resp(200, {'success': True})

        elif action == 'reset_password_confirm':
            email = body.get('email', '').strip().lower()
            code = body.get('code', '').strip()
            new_pw = body.get('new_password', '').strip()
            if len(new_pw) < 6:
                return resp(400, {'error': 'Пароль минимум 6 символов'})
            cur.execute(f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1", (email, code))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный или просроченный код'})
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (row[0],))
            new_hash = hash_password(new_pw)
            cur.execute(f"UPDATE {SCHEMA}.clients SET password_hash=%s, has_password=TRUE, updated_at=NOW() WHERE email=%s", (new_hash, email))
            conn.commit()
            return resp(200, {'success': True})

        # ── email_register/email_login (код без пароля, старый способ) ────────
        elif action in ('email_register', 'email_login'):
            email = body.get('email', '').strip().lower()
            if not email or '@' not in email:
                return resp(400, {'error': 'invalid email'})
            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=10)
            cur.execute(f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)", (email, code, expires))
            conn.commit()
            return resp(200, {'success': True, 'dev_code': code})

        elif action == 'email_verify':
            email = body.get('email', '').strip().lower()
            code = body.get('code', '').strip()
            name = body.get('name', '').strip()
            cur.execute(f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1", (email, code))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный или просроченный код'})
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (row[0],))
            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password FROM {SCHEMA}.clients WHERE email=%s", (email,))
            client = cur.fetchone()
            if not client:
                cur.execute(f"INSERT INTO {SCHEMA}.clients (phone, email, name) VALUES (%s, %s, %s) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password", (email, email, name or None))
                client = cur.fetchone()
            token = gen_token()
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, datetime.now() + timedelta(days=30)))
            conn.commit()
            return resp(200, {'success': True, 'token': token, 'client': client_row_to_dict(client)})

        # ── Yandex OAuth ──────────────────────────────────────────────────────
        elif action == 'yandex_auth':
            yandex_token = body.get('yandex_token', '')
            if not yandex_token:
                return resp(400, {'error': 'yandex_token required'})
            req = urllib.request.Request('https://login.yandex.ru/info?format=json', headers={'Authorization': f'OAuth {yandex_token}'})
            with urllib.request.urlopen(req) as r:
                yd = json.loads(r.read())
            yid = str(yd.get('id'))
            ylogin = yd.get('login', '')
            yname = yd.get('real_name') or yd.get('display_name', '')
            yemail = yd.get('default_email', '')
            aid = yd.get('default_avatar_id')
            avatar = f"https://avatars.yandex.net/get-yapic/{aid}/islands-200" if aid else None
            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password FROM {SCHEMA}.clients WHERE yandex_id=%s", (yid,))
            client = cur.fetchone()
            if not client:
                cur.execute(f"INSERT INTO {SCHEMA}.clients (phone, name, email, yandex_id, yandex_login, yandex_avatar_url) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_login, yandex_avatar_url, has_password", (yemail, yname, yemail, yid, ylogin, avatar))
                client = cur.fetchone()
            else:
                cur.execute(f"UPDATE {SCHEMA}.clients SET yandex_login=%s, yandex_avatar_url=%s, updated_at=NOW() WHERE id=%s", (ylogin, avatar, client[0]))
            token = gen_token()
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s,%s,%s)", (client[0], token, datetime.now() + timedelta(days=30)))
            conn.commit()
            return resp(200, {'success': True, 'token': token, 'client': client_row_to_dict(client)})

        # ── Профиль ───────────────────────────────────────────────────────────
        elif action == 'get_profile':
            token = headers.get('X-Auth-Token', '')
            if not token:
                return resp(401, {'error': 'unauthorized'})
            cur.execute(f"SELECT c.id, c.phone, c.name, c.email, c.bonus_balance, c.loyalty_level, c.visits_count, c.total_spent, c.yandex_login, c.yandex_avatar_url, c.has_password FROM {SCHEMA}.sessions s JOIN {SCHEMA}.clients c ON s.client_id=c.id WHERE s.token=%s AND s.expires_at > NOW()", (token,))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'session expired'})
            return resp(200, {'client': client_row_to_dict(row)})

        elif action == 'update_profile':
            token = headers.get('X-Auth-Token', '')
            cur.execute(f"SELECT client_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()", (token,))
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'unauthorized'})
            cur.execute(f"UPDATE {SCHEMA}.clients SET name=%s, email=%s, updated_at=NOW() WHERE id=%s", (body.get('name'), body.get('email'), row[0]))
            conn.commit()
            return resp(200, {'success': True})

        elif action == 'logout':
            token = headers.get('X-Auth-Token', '')
            cur.execute(f"DELETE FROM {SCHEMA}.sessions WHERE token=%s", (token,))
            conn.commit()
            return resp(200, {'success': True})

        return resp(400, {'error': 'unknown action'})
    finally:
        cur.close()
        conn.close()