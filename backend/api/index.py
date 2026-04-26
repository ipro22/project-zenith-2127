"""
Объединённая функция: авторизация (телефон/Yandex), профиль, проверка статуса в LiveSklad.
Действия задаются полем action в теле запроса.
"""
import json
import os
import random
import string
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35950310_project_zenith_2127')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=64))


def resp(status, payload):
    return {'statusCode': status, 'headers': CORS, 'body': json.dumps(payload, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    action = body.get('action') or params.get('action', '')
    headers = event.get('headers') or {}

    # LiveSklad — без БД
    if action == 'livesklad_status':
        api_key = os.environ.get('LIVESKLAD_API_KEY', 'jjBMBhbeTaVfnHkD2YMU')
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
        # Отправка кода
        if action == 'send_code':
            phone = body.get('phone', '').strip()
            if not phone:
                return resp(400, {'error': 'phone required'})
            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=10)
            cur.execute(f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)", (phone, code, expires))
            conn.commit()
            return resp(200, {'success': True, 'dev_code': code, 'message': 'Код отправлен'})

        # Верификация
        elif action == 'verify_code':
            phone = body.get('phone', '').strip()
            code = body.get('code', '').strip()
            cur.execute(
                f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1",
                (phone, code)
            )
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный или просроченный код'})
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (row[0],))
            cur.execute(f"SELECT id, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_id, yandex_login, yandex_avatar_url FROM {SCHEMA}.clients WHERE phone=%s", (phone,))
            client = cur.fetchone()
            if not client:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.clients (phone) VALUES (%s) RETURNING id, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_id, yandex_login, yandex_avatar_url",
                    (phone,)
                )
                client = cur.fetchone()
            token = generate_token()
            expires = datetime.now() + timedelta(days=30)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, expires))
            conn.commit()
            return resp(200, {
                'success': True, 'token': token,
                'client': {
                    'id': client[0], 'phone': phone, 'name': client[1], 'email': client[2],
                    'bonus_balance': client[3] or 0, 'loyalty_level': client[4] or 'standard',
                    'visits_count': client[5] or 0, 'total_spent': client[6] or 0,
                    'yandex_id': client[7], 'yandex_login': client[8], 'yandex_avatar_url': client[9],
                }
            })

        # Регистрация по email/паролю (упрощённо: храним email в clients, пароль не храним, отправляем код на email — заглушка через dev_code)
        elif action == 'email_register' or action == 'email_login':
            email = body.get('email', '').strip().lower()
            if not email or '@' not in email:
                return resp(400, {'error': 'invalid email'})
            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=10)
            # используем sms_codes как универсальную таблицу кодов
            cur.execute(f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)", (email, code, expires))
            conn.commit()
            return resp(200, {'success': True, 'dev_code': code, 'message': 'Код отправлен на email'})

        elif action == 'email_verify':
            email = body.get('email', '').strip().lower()
            code = body.get('code', '').strip()
            name = body.get('name', '').strip()
            cur.execute(
                f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1",
                (email, code)
            )
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный или просроченный код'})
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (row[0],))
            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent FROM {SCHEMA}.clients WHERE email=%s", (email,))
            client = cur.fetchone()
            if not client:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.clients (phone, email, name) VALUES (%s, %s, %s) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent",
                    (email, email, name or None)
                )
                client = cur.fetchone()
            token = generate_token()
            expires = datetime.now() + timedelta(days=30)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, expires))
            conn.commit()
            return resp(200, {
                'success': True, 'token': token,
                'client': {
                    'id': client[0], 'phone': client[1] or '', 'name': client[2] or name,
                    'email': client[3] or email,
                    'bonus_balance': client[4] or 0, 'loyalty_level': client[5] or 'standard',
                    'visits_count': client[6] or 0, 'total_spent': client[7] or 0,
                }
            })

        # Yandex OAuth
        elif action == 'yandex_auth':
            yandex_token = body.get('yandex_token', '')
            if not yandex_token:
                return resp(400, {'error': 'yandex_token required'})
            req = urllib.request.Request('https://login.yandex.ru/info?format=json', headers={'Authorization': f'OAuth {yandex_token}'})
            with urllib.request.urlopen(req) as r:
                yd = json.loads(r.read())
            yandex_id = str(yd.get('id'))
            yandex_login = yd.get('login', '')
            yandex_name = yd.get('real_name') or yd.get('display_name', '')
            yandex_email = yd.get('default_email', '')
            avatar_id = yd.get('default_avatar_id')
            avatar_url = f"https://avatars.yandex.net/get-yapic/{avatar_id}/islands-200" if avatar_id else None

            cur.execute(f"SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent FROM {SCHEMA}.clients WHERE yandex_id=%s", (yandex_id,))
            client = cur.fetchone()
            if not client:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.clients (phone, name, email, yandex_id, yandex_login, yandex_avatar_url) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent",
                    (yandex_email, yandex_name, yandex_email, yandex_id, yandex_login, avatar_url)
                )
                client = cur.fetchone()
            else:
                cur.execute(f"UPDATE {SCHEMA}.clients SET yandex_login=%s, yandex_avatar_url=%s, updated_at=NOW() WHERE id=%s", (yandex_login, avatar_url, client[0]))

            token = generate_token()
            expires = datetime.now() + timedelta(days=30)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client[0], token, expires))
            conn.commit()
            return resp(200, {
                'success': True, 'token': token,
                'client': {
                    'id': client[0], 'phone': client[1] or '', 'name': client[2] or yandex_name,
                    'email': client[3] or yandex_email,
                    'bonus_balance': client[4] or 0, 'loyalty_level': client[5] or 'standard',
                    'visits_count': client[6] or 0, 'total_spent': client[7] or 0,
                    'yandex_login': yandex_login, 'yandex_avatar_url': avatar_url,
                }
            })

        elif action == 'get_profile':
            token = headers.get('X-Auth-Token', '')
            if not token:
                return resp(401, {'error': 'unauthorized'})
            cur.execute(
                f"SELECT c.id, c.phone, c.name, c.email, c.bonus_balance, c.loyalty_level, c.visits_count, c.total_spent, c.yandex_login, c.yandex_avatar_url FROM {SCHEMA}.sessions s JOIN {SCHEMA}.clients c ON s.client_id=c.id WHERE s.token=%s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'session expired'})
            return resp(200, {'client': {
                'id': row[0], 'phone': row[1], 'name': row[2], 'email': row[3],
                'bonus_balance': row[4] or 0, 'loyalty_level': row[5] or 'standard',
                'visits_count': row[6] or 0, 'total_spent': row[7] or 0,
                'yandex_login': row[8], 'yandex_avatar_url': row[9],
            }})

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
