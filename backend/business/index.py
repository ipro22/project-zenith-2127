"""
Объединённая функция: заявки (создание, история, статус) + админка (клиенты, бонусы, статистика).
Действия задаются полем action.
"""
import json
import os
import random
import string
from datetime import datetime
import psycopg2
import urllib.request

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35950310_project_zenith_2127')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'ipro_admin_2026_secret')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id, X-Admin-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def resp(status, payload):
    return {'statusCode': status, 'headers': CORS, 'body': json.dumps(payload, ensure_ascii=False)}


def gen_order_number():
    return f"IPR-{datetime.now().year}-{''.join(random.choices(string.digits, k=4))}"


def send_max(message: str):
    token = os.environ.get('MAX_BOT_TOKEN', '')
    chat_id = os.environ.get('MAX_BOT_CHAT_ID', '')
    if not token or not chat_id:
        return
    url = f"https://botapi.myteam.mail.ru/messages/sendText?token={token}"
    payload = json.dumps({'chatId': str(chat_id), 'text': message}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        urllib.request.urlopen(req, timeout=8)
    except Exception:
        pass


def get_client_id(cur, token):
    if not token:
        return None
    cur.execute(f"SELECT client_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()", (token,))
    row = cur.fetchone()
    return row[0] if row else None


def update_loyalty(cur, client_id, price):
    cur.execute(f"SELECT visits_count, total_spent FROM {SCHEMA}.clients WHERE id=%s", (client_id,))
    row = cur.fetchone()
    if not row:
        return 0
    visits = (row[0] or 0) + 1
    total = (row[1] or 0) + price
    bonus = int(price * 0.05)
    level = 'standard'
    if visits >= 5:
        level, bonus = 'vip', int(price * 0.10)
    elif visits >= 3:
        level, bonus = 'regular', int(price * 0.07)
    cur.execute(
        f"UPDATE {SCHEMA}.clients SET visits_count=%s, total_spent=%s, bonus_balance=bonus_balance+%s, loyalty_level=%s, updated_at=NOW() WHERE id=%s",
        (visits, total, bonus, level, client_id)
    )
    return bonus


def is_admin(headers):
    return headers.get('X-Admin-Token', '') == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    headers = event.get('headers') or {}
    action = body.get('action') or params.get('action', '')
    auth_token = headers.get('X-Auth-Token', '')

    conn = get_conn()
    cur = conn.cursor()
    try:
        # ========== ПУБЛИЧНЫЕ / КЛИЕНТСКИЕ ==========
        if action == 'create_order':
            client_name = body.get('client_name', '')
            client_phone = body.get('client_phone', '')
            device_brand = body.get('device_brand', '')
            device_model = body.get('device_model', '')
            service_name = body.get('service_name', '')
            service_price = body.get('service_price', 0) or 0
            comment = body.get('comment', '')
            bonus_used = body.get('bonus_used', 0) or 0
            source = body.get('source', 'calculator')

            if not client_phone:
                return resp(400, {'error': 'phone required'})

            order_number = gen_order_number()
            client_id = get_client_id(cur, auth_token)
            if not client_id:
                cur.execute(f"SELECT id FROM {SCHEMA}.clients WHERE phone=%s", (client_phone,))
                row = cur.fetchone()
                if row:
                    client_id = row[0]
                else:
                    cur.execute(f"INSERT INTO {SCHEMA}.clients (phone, name) VALUES (%s, %s) RETURNING id", (client_phone, client_name))
                    client_id = cur.fetchone()[0]

            bonus_earned = 0
            if client_id and service_price > 0:
                bonus_earned = update_loyalty(cur, client_id, service_price)
            if bonus_used > 0 and client_id:
                cur.execute(f"UPDATE {SCHEMA}.clients SET bonus_balance=bonus_balance-%s WHERE id=%s AND bonus_balance>=%s", (bonus_used, client_id, bonus_used))

            cur.execute(
                f"""INSERT INTO {SCHEMA}.repair_orders 
                (order_number, client_id, client_name, client_phone, device_brand, device_model, service_name, service_price, comment, bonus_earned, bonus_used, source)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (order_number, client_id, client_name, client_phone, device_brand, device_model, service_name, service_price, comment, bonus_earned, bonus_used, source)
            )
            order_id = cur.fetchone()[0]
            if bonus_earned > 0 and client_id:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.bonus_transactions (client_id, order_id, type, amount, description) VALUES (%s, %s, %s, %s, %s)",
                    (client_id, order_id, 'earn', bonus_earned, f'Начислено за заказ {order_number}')
                )
            conn.commit()

            send_max(
                f"Новая заявка {order_number}\n"
                f"Клиент: {client_name or '-'} / {client_phone}\n"
                f"Устройство: {device_brand} {device_model}\n"
                f"Услуга: {service_name} — {service_price} ₽\n"
                f"Комментарий: {comment or '-'}"
            )
            return resp(200, {'success': True, 'order_number': order_number, 'bonus_earned': bonus_earned})

        elif action == 'my_orders':
            client_id = get_client_id(cur, auth_token)
            if not client_id:
                return resp(401, {'error': 'unauthorized'})
            cur.execute(
                f"""SELECT order_number, device_brand, device_model, service_name, service_price, status, bonus_earned, bonus_used, created_at
                FROM {SCHEMA}.repair_orders WHERE client_id=%s ORDER BY created_at DESC LIMIT 20""",
                (client_id,)
            )
            orders = [{
                'order_number': r[0], 'device_brand': r[1], 'device_model': r[2], 'service_name': r[3],
                'service_price': r[4], 'status': r[5], 'bonus_earned': r[6], 'bonus_used': r[7],
                'created_at': r[8].isoformat() if r[8] else None,
            } for r in cur.fetchall()]
            return resp(200, {'orders': orders})

        elif action == 'bonus_history':
            client_id = get_client_id(cur, auth_token)
            if not client_id:
                return resp(401, {'error': 'unauthorized'})
            cur.execute(f"SELECT type, amount, description, created_at FROM {SCHEMA}.bonus_transactions WHERE client_id=%s ORDER BY created_at DESC LIMIT 30", (client_id,))
            tx = [{'type': r[0], 'amount': r[1], 'description': r[2], 'created_at': r[3].isoformat()} for r in cur.fetchall()]
            return resp(200, {'transactions': tx})

        elif action == 'check_status':
            order_number = body.get('order_number', '') or params.get('order_number', '')
            cur.execute(
                f"SELECT order_number, device_brand, device_model, service_name, service_price, status, created_at FROM {SCHEMA}.repair_orders WHERE order_number=%s",
                (order_number,)
            )
            row = cur.fetchone()
            if not row:
                return resp(404, {'error': 'Заказ не найден'})
            return resp(200, {'order': {
                'order_number': row[0], 'device_brand': row[1], 'device_model': row[2],
                'service_name': row[3], 'service_price': row[4], 'status': row[5],
                'created_at': row[6].isoformat() if row[6] else None,
            }})

        # ========== АДМИНКА ==========
        if action.startswith('admin_'):
            if not is_admin(headers):
                return resp(403, {'error': 'Forbidden'})

            if action == 'admin_list_clients':
                search = body.get('search', '')
                limit = int(body.get('limit', 50))
                offset = int(body.get('offset', 0))
                if search:
                    cur.execute(
                        f"""SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, created_at
                        FROM {SCHEMA}.clients WHERE phone ILIKE %s OR name ILIKE %s OR email ILIKE %s
                        ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                        (f'%{search}%', f'%{search}%', f'%{search}%', limit, offset)
                    )
                else:
                    cur.execute(
                        f"""SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, created_at
                        FROM {SCHEMA}.clients ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                        (limit, offset)
                    )
                clients = [{
                    'id': r[0], 'phone': r[1], 'name': r[2], 'email': r[3],
                    'bonus_balance': r[4] or 0, 'loyalty_level': r[5] or 'standard',
                    'visits_count': r[6] or 0, 'total_spent': r[7] or 0,
                    'created_at': r[8].isoformat() if r[8] else None,
                } for r in cur.fetchall()]
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients")
                return resp(200, {'clients': clients, 'total': cur.fetchone()[0]})

            elif action == 'admin_add_client':
                phone = body.get('phone', '').strip()
                if not phone:
                    return resp(400, {'error': 'phone required'})
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.clients (phone, name, email, bonus_balance, loyalty_level)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (phone) DO UPDATE SET name=EXCLUDED.name, email=EXCLUDED.email, updated_at=NOW()
                    RETURNING id""",
                    (phone, body.get('name') or None, body.get('email') or None,
                     int(body.get('bonus_balance', 0)), body.get('loyalty_level', 'standard'))
                )
                cid = cur.fetchone()[0]
                conn.commit()
                return resp(200, {'success': True, 'client_id': cid})

            elif action == 'admin_adjust_bonus':
                cid = body.get('client_id')
                amount = int(body.get('amount', 0))
                description = body.get('description', 'Ручное начисление администратором')
                if not cid:
                    return resp(400, {'error': 'client_id required'})
                cur.execute(f"UPDATE {SCHEMA}.clients SET bonus_balance=bonus_balance+%s, updated_at=NOW() WHERE id=%s RETURNING bonus_balance", (amount, cid))
                row = cur.fetchone()
                if not row:
                    return resp(404, {'error': 'client not found'})
                cur.execute(
                    f"INSERT INTO {SCHEMA}.bonus_transactions (client_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                    (cid, 'earn' if amount > 0 else 'spend', abs(amount), description)
                )
                conn.commit()
                return resp(200, {'success': True, 'new_balance': row[0]})

            elif action == 'admin_list_orders':
                limit = int(body.get('limit', 50))
                offset = int(body.get('offset', 0))
                status_filter = body.get('status', '')
                if status_filter:
                    cur.execute(
                        f"""SELECT order_number, client_name, client_phone, device_brand, device_model, service_name, service_price, status, bonus_earned, created_at
                        FROM {SCHEMA}.repair_orders WHERE status=%s ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                        (status_filter, limit, offset)
                    )
                else:
                    cur.execute(
                        f"""SELECT order_number, client_name, client_phone, device_brand, device_model, service_name, service_price, status, bonus_earned, created_at
                        FROM {SCHEMA}.repair_orders ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                        (limit, offset)
                    )
                orders = [{
                    'order_number': r[0], 'client_name': r[1], 'client_phone': r[2],
                    'device_brand': r[3], 'device_model': r[4], 'service_name': r[5],
                    'service_price': r[6], 'status': r[7], 'bonus_earned': r[8],
                    'created_at': r[9].isoformat() if r[9] else None,
                } for r in cur.fetchall()]
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders")
                return resp(200, {'orders': orders, 'total': cur.fetchone()[0]})

            elif action == 'admin_update_order_status':
                order_number = body.get('order_number', '')
                new_status = body.get('status', '')
                if new_status not in ['received', 'diagnostics', 'repair', 'ready', 'completed']:
                    return resp(400, {'error': 'invalid status'})
                cur.execute(f"UPDATE {SCHEMA}.repair_orders SET status=%s, updated_at=NOW() WHERE order_number=%s", (new_status, order_number))
                conn.commit()
                return resp(200, {'success': True})

            elif action == 'admin_update_client':
                cur.execute(
                    f"UPDATE {SCHEMA}.clients SET name=%s, email=%s, loyalty_level=%s, phone=%s, updated_at=NOW() WHERE id=%s",
                    (body.get('name'), body.get('email'), body.get('loyalty_level'), body.get('phone'), body.get('client_id'))
                )
                conn.commit()
                return resp(200, {'success': True})

            elif action == 'admin_stats':
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients")
                tc = cur.fetchone()[0]
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders")
                to = cur.fetchone()[0]
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders WHERE status='received'")
                no = cur.fetchone()[0]
                cur.execute(f"SELECT COALESCE(SUM(service_price),0) FROM {SCHEMA}.repair_orders WHERE status='completed'")
                tr = cur.fetchone()[0]
                cur.execute(f"SELECT COALESCE(SUM(bonus_balance),0) FROM {SCHEMA}.clients")
                tb = cur.fetchone()[0]
                return resp(200, {'total_clients': tc, 'total_orders': to, 'new_orders': no,
                                 'total_revenue': int(tr or 0), 'total_bonuses': int(tb or 0)})

            elif action == 'admin_confirm_order_bonus':
                order_number = body.get('order_number', '')
                cur.execute(f"SELECT id, client_id, service_price, status FROM {SCHEMA}.repair_orders WHERE order_number=%s", (order_number,))
                row = cur.fetchone()
                if not row:
                    return resp(404, {'error': 'order not found'})
                order_id, client_id, price, status = row
                if status == 'completed':
                    return resp(400, {'error': 'already confirmed'})
                bonus = int((price or 0) * 0.05)
                cur.execute(f"UPDATE {SCHEMA}.repair_orders SET status='completed', bonus_earned=%s, updated_at=NOW() WHERE id=%s", (bonus, order_id))
                if client_id and bonus > 0:
                    cur.execute(f"UPDATE {SCHEMA}.clients SET bonus_balance=bonus_balance+%s, visits_count=visits_count+1, updated_at=NOW() WHERE id=%s", (bonus, client_id))
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.bonus_transactions (client_id, order_id, type, amount, description) VALUES (%s, %s, %s, %s, %s)",
                        (client_id, order_id, 'earn', bonus, f'Начислено за выполненный ремонт {order_number}')
                    )
                conn.commit()
                return resp(200, {'success': True, 'bonus_earned': bonus})

        return resp(400, {'error': 'unknown action'})
    finally:
        cur.close()
        conn.close()
