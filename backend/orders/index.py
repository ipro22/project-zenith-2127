"""
Управление заявками на ремонт: создание, получение истории, обновление статуса.
Отправляет уведомления в бот Max при новых заявках.
"""
import json
import os
import random
import string
from datetime import datetime
import psycopg2
import urllib.request
import urllib.parse

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35950310_project_zenith_2127')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def generate_order_number():
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"IPR-{year}-{suffix}"


def send_max_notification(message: str):
    token = os.environ.get('MAX_BOT_TOKEN', 'f9LHodD0cOLSAb2AlC0NK3863_SFzpD49METag9kejij-ngkdOh1gLg-ZoTv6zi3SYzuoVCboPFZLy7xJb3e')
    chat_id = os.environ.get('MAX_BOT_CHAT_ID', '222334516050')
    if not token or not chat_id:
        return

    url = f"https://botapi.myteam.mail.ru/messages/sendText?token={token}"
    payload = json.dumps({
        'chatId': str(chat_id),
        'text': message
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        urllib.request.urlopen(req, timeout=8)
    except Exception:
        pass


def get_client_id_from_token(cur, token):
    if not token:
        return None
    cur.execute(
        f"SELECT client_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    return row[0] if row else None


def update_loyalty(cur, conn, client_id, order_price):
    cur.execute(f"SELECT visits_count, total_spent FROM {SCHEMA}.clients WHERE id=%s", (client_id,))
    row = cur.fetchone()
    if not row:
        return 0

    visits = (row[0] or 0) + 1
    total = (row[1] or 0) + order_price
    bonus = int(order_price * 0.05)

    level = 'standard'
    if visits >= 5:
        level = 'vip'
        bonus = int(order_price * 0.10)
    elif visits >= 3:
        level = 'regular'
        bonus = int(order_price * 0.07)

    cur.execute(
        f"UPDATE {SCHEMA}.clients SET visits_count=%s, total_spent=%s, bonus_balance=bonus_balance+%s, loyalty_level=%s, updated_at=NOW() WHERE id=%s",
        (visits, total, bonus, level, client_id)
    )
    return bonus


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'POST')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action') or (event.get('queryStringParameters') or {}).get('action', '')
    token = (event.get('headers') or {}).get('X-Auth-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Создание заявки
        if action == 'create' or method == 'POST' and not action:
            client_name = body.get('client_name', '')
            client_phone = body.get('client_phone', '')
            device_brand = body.get('device_brand', '')
            device_model = body.get('device_model', '')
            service_name = body.get('service_name', '')
            service_price = body.get('service_price', 0)
            comment = body.get('comment', '')
            bonus_used = body.get('bonus_used', 0)
            source = body.get('source', 'calculator')

            if not client_phone:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'phone required'})}

            order_number = generate_order_number()

            client_id = get_client_id_from_token(cur, token)

            if not client_id:
                cur.execute(f"SELECT id FROM {SCHEMA}.clients WHERE phone=%s", (client_phone,))
                row = cur.fetchone()
                if row:
                    client_id = row[0]
                else:
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.clients (phone, name) VALUES (%s, %s) RETURNING id",
                        (client_phone, client_name)
                    )
                    client_id = cur.fetchone()[0]

            bonus_earned = 0
            if client_id and service_price > 0:
                bonus_earned = update_loyalty(cur, conn, client_id, service_price)

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

            msg = (
                f"📱 *Новая заявка на ремонт!*\n\n"
                f"📋 Номер: {order_number}\n"
                f"👤 Клиент: {client_name or 'Не указано'}\n"
                f"📞 Телефон: {client_phone}\n"
                f"📱 Устройство: {device_brand} {device_model}\n"
                f"🔧 Услуга: {service_name}\n"
                f"💰 Стоимость: {service_price:,} ₽\n"
                f"💬 Комментарий: {comment or 'Нет'}\n"
                f"🎁 Бонусов начислено: {bonus_earned}\n"
                f"⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"
            )
            send_max_notification(msg)

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'success': True,
                    'order_number': order_number,
                    'bonus_earned': bonus_earned,
                })
            }

        # История заказов клиента
        elif action == 'my_orders':
            client_id = get_client_id_from_token(cur, token)
            if not client_id:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'unauthorized'})}

            cur.execute(
                f"""SELECT order_number, device_brand, device_model, service_name, service_price, status, bonus_earned, bonus_used, created_at
                FROM {SCHEMA}.repair_orders WHERE client_id=%s ORDER BY created_at DESC LIMIT 20""",
                (client_id,)
            )
            rows = cur.fetchall()
            orders = []
            for r in rows:
                orders.append({
                    'order_number': r[0],
                    'device_brand': r[1],
                    'device_model': r[2],
                    'service_name': r[3],
                    'service_price': r[4],
                    'status': r[5],
                    'bonus_earned': r[6],
                    'bonus_used': r[7],
                    'created_at': r[8].isoformat() if r[8] else None,
                })
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders})}

        # История бонусных транзакций
        elif action == 'bonus_history':
            client_id = get_client_id_from_token(cur, token)
            if not client_id:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'unauthorized'})}

            cur.execute(
                f"SELECT type, amount, description, created_at FROM {SCHEMA}.bonus_transactions WHERE client_id=%s ORDER BY created_at DESC LIMIT 30",
                (client_id,)
            )
            rows = cur.fetchall()
            transactions = [{'type': r[0], 'amount': r[1], 'description': r[2], 'created_at': r[3].isoformat()} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'transactions': transactions})}

        # Проверка статуса заказа по номеру (публичный)
        elif action == 'check_status':
            order_number = body.get('order_number', '') or (event.get('queryStringParameters') or {}).get('order_number', '')
            cur.execute(
                f"SELECT order_number, device_brand, device_model, service_name, service_price, status, created_at FROM {SCHEMA}.repair_orders WHERE order_number=%s",
                (order_number,)
            )
            row = cur.fetchone()
            if not row:
                # Fallback to LiveSklad
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Заказ не найден'})}

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({
                    'order': {
                        'order_number': row[0],
                        'device_brand': row[1],
                        'device_model': row[2],
                        'service_name': row[3],
                        'service_price': row[4],
                        'status': row[5],
                        'created_at': row[6].isoformat() if row[6] else None,
                    }
                })
            }

        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}

    finally:
        cur.close()
        conn.close()