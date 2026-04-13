"""
Авторизация клиентов: отправка SMS-кода, верификация, выход.
Поддерживает вход по телефону и OAuth через Яндекс ID.
"""
import json
import os
import random
import string
import hashlib
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


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'POST')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action') or event.get('queryStringParameters', {}).get('action', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Отправка кода подтверждения
        if action == 'send_code':
            phone = body.get('phone', '').strip()
            if not phone:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'phone required'})}

            code = ''.join(random.choices(string.digits, k=4))
            expires = datetime.now() + timedelta(minutes=10)

            cur.execute(
                f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
                (phone, code, expires)
            )
            conn.commit()

            # TODO: здесь можно подключить реальную SMS-отправку
            # Для dev режима возвращаем код в ответе
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'success': True, 'dev_code': code, 'message': 'Код отправлен'})
            }

        # Верификация кода
        elif action == 'verify_code':
            phone = body.get('phone', '').strip()
            code = body.get('code', '').strip()

            cur.execute(
                f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY created_at DESC LIMIT 1",
                (phone, code)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный или просроченный код'})}

            sms_id = row[0]
            cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (sms_id,))

            # Найти или создать клиента
            cur.execute(f"SELECT id, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_id, yandex_login, yandex_avatar_url FROM {SCHEMA}.clients WHERE phone=%s", (phone,))
            client = cur.fetchone()

            if not client:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.clients (phone) VALUES (%s) RETURNING id, name, email, bonus_balance, loyalty_level, visits_count, total_spent, yandex_id, yandex_login, yandex_avatar_url",
                    (phone,)
                )
                client = cur.fetchone()

            client_id = client[0]
            token = generate_token()
            expires = datetime.now() + timedelta(days=30)

            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)",
                (client_id, token, expires)
            )
            conn.commit()

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'client': {
                        'id': client[0],
                        'phone': phone,
                        'name': client[1],
                        'email': client[2],
                        'bonus_balance': client[3] or 0,
                        'loyalty_level': client[4] or 'standard',
                        'visits_count': client[5] or 0,
                        'total_spent': client[6] or 0,
                        'yandex_id': client[7],
                        'yandex_login': client[8],
                        'yandex_avatar_url': client[9],
                    }
                })
            }

        # Яндекс OAuth
        elif action == 'yandex_auth':
            yandex_token = body.get('yandex_token', '')
            if not yandex_token:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'yandex_token required'})}

            import urllib.request
            req = urllib.request.Request(
                'https://login.yandex.ru/info?format=json',
                headers={'Authorization': f'OAuth {yandex_token}'}
            )
            with urllib.request.urlopen(req) as resp:
                yandex_data = json.loads(resp.read())

            yandex_id = str(yandex_data.get('id'))
            yandex_login = yandex_data.get('login', '')
            yandex_name = yandex_data.get('real_name') or yandex_data.get('display_name', '')
            yandex_email = yandex_data.get('default_email', '')
            avatar_id = yandex_data.get('default_avatar_id')
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
                cur.execute(
                    f"UPDATE {SCHEMA}.clients SET yandex_login=%s, yandex_avatar_url=%s, updated_at=NOW() WHERE id=%s",
                    (yandex_login, avatar_url, client[0])
                )

            client_id = client[0]
            token = generate_token()
            expires = datetime.now() + timedelta(days=30)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (client_id, token, expires_at) VALUES (%s, %s, %s)", (client_id, token, expires))
            conn.commit()

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'client': {
                        'id': client[0],
                        'phone': client[1] or '',
                        'name': client[2] or yandex_name,
                        'email': client[3] or yandex_email,
                        'bonus_balance': client[4] or 0,
                        'loyalty_level': client[5] or 'standard',
                        'visits_count': client[6] or 0,
                        'total_spent': client[7] or 0,
                        'yandex_login': yandex_login,
                        'yandex_avatar_url': avatar_url,
                    }
                })
            }

        # Получение профиля по токену
        elif action == 'get_profile':
            token = (event.get('headers') or {}).get('X-Auth-Token', '')
            if not token:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'unauthorized'})}

            cur.execute(
                f"SELECT c.id, c.phone, c.name, c.email, c.bonus_balance, c.loyalty_level, c.visits_count, c.total_spent, c.yandex_login, c.yandex_avatar_url FROM {SCHEMA}.sessions s JOIN {SCHEMA}.clients c ON s.client_id=c.id WHERE s.token=%s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'session expired'})}

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'client': {
                        'id': row[0], 'phone': row[1], 'name': row[2], 'email': row[3],
                        'bonus_balance': row[4] or 0, 'loyalty_level': row[5] or 'standard',
                        'visits_count': row[6] or 0, 'total_spent': row[7] or 0,
                        'yandex_login': row[8], 'yandex_avatar_url': row[9],
                    }
                })
            }

        # Обновление профиля
        elif action == 'update_profile':
            token = (event.get('headers') or {}).get('X-Auth-Token', '')
            cur.execute(f"SELECT client_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()", (token,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'unauthorized'})}

            client_id = row[0]
            name = body.get('name')
            email = body.get('email')
            cur.execute(f"UPDATE {SCHEMA}.clients SET name=%s, email=%s, updated_at=NOW() WHERE id=%s", (name, email, client_id))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

        # Выход
        elif action == 'logout':
            token = (event.get('headers') or {}).get('X-Auth-Token', '')
            cur.execute(f"DELETE FROM {SCHEMA}.sessions WHERE token=%s", (token,))
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}

    finally:
        cur.close()
        conn.close()
