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
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '12233445')

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
    print("ТЕСТ СЕКРЕТОВ:", os.environ.get('MAX_BOT_TOKEN', 'НЕ НАЙДЕН'), os.environ.get('MAX_BOT_CHAT_ID', 'НЕ НАЙДЕН'))

    targets = [
        (os.environ.get('MAX_BOT_TOKEN', ''), os.environ.get('MAX_BOT_CHAT_ID', '')),
        (os.environ.get('MAX_BOT_TOKEN1', ''), os.environ.get('MAX_BOT_CHAT_ID1', '')),
    ]
    for token, chat_id in targets:
        if not token or not chat_id:
            continue
        url = f"https://botapi.myteam.mail.ru/messages/sendText?token={token}"
        payload = json.dumps({'chatId': str(chat_id), 'text': message}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
        try:
            urllib.request.urlopen(req, timeout=8)
        except Exception:
            pass


def send_telegram(conn_cur, message: str):
    cur = conn_cur
    try:
        cur.execute(f"SELECT value FROM {SCHEMA}.site_content WHERE section='telegram' AND key='bot_token'")
        r = cur.fetchone()
        tg_token = r[0] if r else ''
        cur.execute(f"SELECT value FROM {SCHEMA}.site_content WHERE section='telegram' AND key='chat_id'")
        r2 = cur.fetchone()
        tg_chat = r2[0] if r2 else ''
        tg_token = tg_token or os.environ.get('TELEGRAM_BOT_TOKEN', '')
        tg_chat = tg_chat or os.environ.get('TELEGRAM_CHAT_ID', '')
        if not tg_token or not tg_chat:
            return
        url = f"https://api.telegram.org/bot{tg_token}/sendMessage"
        payload = json.dumps({'chat_id': tg_chat, 'text': message, 'parse_mode': 'HTML'}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
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

            price_fmt = f"{int(service_price):,}".replace(",", " ")
            msg = (
                f"📱 НОВАЯ ЗАЯВКА iPro\n"
                f"━━━━━━━━━━━━━━━━━━\n"
                f"📋 Номер: {order_number}\n"
                f"👤 Клиент: {client_name or 'Не указано'}\n"
                f"📞 Телефон: {client_phone}\n"
                f"📱 Устройство: {device_brand} {device_model}\n"
                f"🔧 Услуга: {service_name}\n"
                f"💰 Стоимость: {price_fmt} ₽\n"
                f"💬 Комментарий: {comment or 'Нет'}\n"
                f"🎁 Бонусов начислено: {bonus_earned}\n"
                f"📍 Источник: {source}\n"
                f"⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"
            )
            send_max(msg)
            tg_msg = (
                f"<b>📱 Новая заявка iPro</b>\n"
                f"━━━━━━━━━━━━━━━━━━\n"
                f"📋 <b>Номер:</b> {order_number}\n"
                f"👤 <b>Клиент:</b> {client_name or 'Не указано'}\n"
                f"📞 <b>Телефон:</b> {client_phone}\n"
                f"📱 <b>Устройство:</b> {device_brand} {device_model}\n"
                f"🔧 <b>Услуга:</b> {service_name}\n"
                f"💰 <b>Стоимость:</b> {price_fmt} ₽\n"
                f"💬 <b>Комментарий:</b> {comment or 'Нет'}\n"
                f"⏰ {datetime.now().strftime('%d.%m.%Y %H:%M')}"
            )
            send_telegram(cur, tg_msg)
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

            # ── Редактор контента сайта ──────────────────────────────────
            elif action == 'admin_get_content':
                section = body.get('section', '')
                if section:
                    cur.execute(f"SELECT section, key, value, type, label FROM {SCHEMA}.site_content WHERE section=%s ORDER BY key", (section,))
                else:
                    cur.execute(f"SELECT section, key, value, type, label FROM {SCHEMA}.site_content ORDER BY section, key")
                rows = cur.fetchall()
                content = {}
                for r in rows:
                    sec = r[0]
                    if sec not in content:
                        content[sec] = []
                    content[sec].append({'key': r[1], 'value': r[2], 'type': r[3], 'label': r[4]})
                return resp(200, {'content': content})

            elif action == 'admin_update_content':
                updates = body.get('updates', [])
                for item in updates:
                    sec = item.get('section', '')
                    key = item.get('key', '')
                    value = item.get('value', '')
                    if sec and key:
                        cur.execute(
                            f"INSERT INTO {SCHEMA}.site_content (section, key, value, updated_at) VALUES (%s, %s, %s, NOW()) ON CONFLICT (section, key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()",
                            (sec, key, value)
                        )
                conn.commit()
                return resp(200, {'success': True, 'updated': len(updates)})

            # ── Магазин ──────────────────────────────────────────────────
            elif action == 'admin_list_products':
                cur.execute(f"SELECT id, name, brand, category, description, price, old_price, image_url, badge, in_stock, sort_order, created_at FROM {SCHEMA}.shop_products ORDER BY sort_order, id")
                products = [{
                    'id': r[0], 'name': r[1], 'brand': r[2], 'category': r[3], 'description': r[4],
                    'price': r[5], 'old_price': r[6], 'image_url': r[7], 'badge': r[8],
                    'in_stock': r[9], 'sort_order': r[10], 'created_at': r[11].isoformat() if r[11] else None,
                } for r in cur.fetchall()]
                return resp(200, {'products': products})

            elif action == 'admin_save_product':
                pid = body.get('id')
                name = body.get('name', '').strip()
                if not name:
                    return resp(400, {'error': 'name required'})
                fields = {
                    'name': name, 'brand': body.get('brand', ''), 'category': body.get('category', ''),
                    'description': body.get('description', ''), 'price': int(body.get('price', 0)),
                    'old_price': body.get('old_price') or None, 'image_url': body.get('image_url', ''),
                    'badge': body.get('badge', '') or None, 'in_stock': bool(body.get('in_stock', True)),
                    'sort_order': int(body.get('sort_order', 0)),
                }
                if pid:
                    cur.execute(
                        f"UPDATE {SCHEMA}.shop_products SET name=%s,brand=%s,category=%s,description=%s,price=%s,old_price=%s,image_url=%s,badge=%s,in_stock=%s,sort_order=%s,updated_at=NOW() WHERE id=%s",
                        (fields['name'], fields['brand'], fields['category'], fields['description'], fields['price'], fields['old_price'], fields['image_url'], fields['badge'], fields['in_stock'], fields['sort_order'], pid)
                    )
                    conn.commit()
                    return resp(200, {'success': True, 'id': pid})
                else:
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.shop_products (name,brand,category,description,price,old_price,image_url,badge,in_stock,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                        (fields['name'], fields['brand'], fields['category'], fields['description'], fields['price'], fields['old_price'], fields['image_url'], fields['badge'], fields['in_stock'], fields['sort_order'])
                    )
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return resp(200, {'success': True, 'id': new_id})

            elif action == 'admin_delete_product':
                pid = body.get('id')
                if not pid:
                    return resp(400, {'error': 'id required'})
                cur.execute(f"DELETE FROM {SCHEMA}.shop_products WHERE id=%s", (pid,))
                conn.commit()
                return resp(200, {'success': True})

            # ── Получить бонус-историю клиента (для CRM) ─────────────────
            elif action == 'admin_client_bonus_history':
                cid = body.get('client_id')
                if not cid:
                    return resp(400, {'error': 'client_id required'})
                cur.execute(
                    f"SELECT type, amount, description, created_at FROM {SCHEMA}.bonus_transactions WHERE client_id=%s ORDER BY created_at DESC LIMIT 50",
                    (cid,)
                )
                tx = [{'type': r[0], 'amount': r[1], 'description': r[2], 'created_at': r[3].isoformat()} for r in cur.fetchall()]
                cur.execute(f"SELECT order_number, device_brand, device_model, service_name, service_price, status, created_at FROM {SCHEMA}.repair_orders WHERE client_id=%s ORDER BY created_at DESC LIMIT 30", (cid,))
                orders = [{'order_number': r[0], 'device_brand': r[1], 'device_model': r[2], 'service_name': r[3], 'service_price': r[4], 'status': r[5], 'created_at': r[6].isoformat() if r[6] else None} for r in cur.fetchall()]
                return resp(200, {'transactions': tx, 'orders': orders})

            # ── Удалить клиента ───────────────────────────────────────────
            elif action == 'admin_delete_client':
                cid = body.get('client_id')
                if not cid:
                    return resp(400, {'error': 'client_id required'})
                cur.execute(f"DELETE FROM {SCHEMA}.bonus_transactions WHERE client_id=%s", (cid,))
                cur.execute(f"DELETE FROM {SCHEMA}.sessions WHERE client_id=%s", (cid,))
                cur.execute(f"UPDATE {SCHEMA}.repair_orders SET client_id=NULL WHERE client_id=%s", (cid,))
                cur.execute(f"DELETE FROM {SCHEMA}.clients WHERE id=%s", (cid,))
                conn.commit()
                return resp(200, {'success': True})

            # ── Удалить заказ ─────────────────────────────────────────────
            elif action == 'admin_delete_order':
                order_number = body.get('order_number', '')
                cur.execute(f"DELETE FROM {SCHEMA}.bonus_transactions WHERE order_id=(SELECT id FROM {SCHEMA}.repair_orders WHERE order_number=%s)", (order_number,))
                cur.execute(f"DELETE FROM {SCHEMA}.repair_orders WHERE order_number=%s", (order_number,))
                conn.commit()
                return resp(200, {'success': True})

            # ── Истории ───────────────────────────────────────────────────
            elif action == 'admin_list_stories':
                cur.execute(f"SELECT id, title, subtitle, image_url, link_url, link_label, gradient_from, gradient_to, is_active, sort_order FROM {SCHEMA}.stories ORDER BY sort_order, id")
                stories = [{'id': r[0], 'title': r[1], 'subtitle': r[2], 'image_url': r[3], 'link_url': r[4], 'link_label': r[5], 'gradient_from': r[6], 'gradient_to': r[7], 'is_active': r[8], 'sort_order': r[9]} for r in cur.fetchall()]
                return resp(200, {'stories': stories})

            elif action == 'admin_save_story':
                sid = body.get('id')
                title = body.get('title', '').strip()
                if not title:
                    return resp(400, {'error': 'title required'})
                fields = (title, body.get('subtitle', ''), body.get('image_url', ''), body.get('link_url', ''), body.get('link_label', 'Подробнее'), body.get('gradient_from', '#1d4ed8'), body.get('gradient_to', '#7c3aed'), bool(body.get('is_active', True)), int(body.get('sort_order', 0)))
                if sid:
                    cur.execute(f"UPDATE {SCHEMA}.stories SET title=%s,subtitle=%s,image_url=%s,link_url=%s,link_label=%s,gradient_from=%s,gradient_to=%s,is_active=%s,sort_order=%s WHERE id=%s", (*fields, sid))
                    conn.commit()
                    return resp(200, {'success': True, 'id': sid})
                else:
                    cur.execute(f"INSERT INTO {SCHEMA}.stories (title,subtitle,image_url,link_url,link_label,gradient_from,gradient_to,is_active,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id", fields)
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return resp(200, {'success': True, 'id': new_id})

            elif action == 'admin_delete_story':
                cur.execute(f"DELETE FROM {SCHEMA}.stories WHERE id=%s", (body.get('id'),))
                conn.commit()
                return resp(200, {'success': True})

            # ── Цены на услуги ────────────────────────────────────────────
            elif action == 'admin_list_prices':
                brand = body.get('brand_slug', '')
                if brand:
                    cur.execute(f"SELECT id, brand_slug, brand_name, model_slug, model_name, service_name, price_text, price_num, sort_order, is_active FROM {SCHEMA}.service_prices WHERE brand_slug=%s ORDER BY model_slug, sort_order", (brand,))
                else:
                    cur.execute(f"SELECT id, brand_slug, brand_name, model_slug, model_name, service_name, price_text, price_num, sort_order, is_active FROM {SCHEMA}.service_prices ORDER BY brand_slug, model_slug, sort_order LIMIT 1000")
                prices = [{'id': r[0], 'brand_slug': r[1], 'brand_name': r[2], 'model_slug': r[3], 'model_name': r[4], 'service_name': r[5], 'price_text': r[6], 'price_num': r[7], 'sort_order': r[8], 'is_active': r[9]} for r in cur.fetchall()]
                return resp(200, {'prices': prices})

            elif action == 'admin_save_price':
                pid = body.get('id')
                brand_slug = body.get('brand_slug', '').strip()
                model_slug = body.get('model_slug', '').strip()
                service_name = body.get('service_name', '').strip()
                price_num = int(body.get('price_num', 0))
                price_text = body.get('price_text') or f'от {price_num:,} ₽'.replace(',', ' ')
                if not brand_slug or not model_slug or not service_name:
                    return resp(400, {'error': 'brand_slug, model_slug, service_name required'})
                fields = (brand_slug, body.get('brand_name', brand_slug), model_slug, body.get('model_name', model_slug), service_name, price_text, price_num, int(body.get('sort_order', 0)), bool(body.get('is_active', True)))
                if pid:
                    cur.execute(f"UPDATE {SCHEMA}.service_prices SET brand_slug=%s,brand_name=%s,model_slug=%s,model_name=%s,service_name=%s,price_text=%s,price_num=%s,sort_order=%s,is_active=%s,updated_at=NOW() WHERE id=%s", (*fields, pid))
                    conn.commit()
                    return resp(200, {'success': True, 'id': pid})
                else:
                    cur.execute(f"INSERT INTO {SCHEMA}.service_prices (brand_slug,brand_name,model_slug,model_name,service_name,price_text,price_num,sort_order,is_active) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (brand_slug,model_slug,service_name) DO UPDATE SET price_text=EXCLUDED.price_text,price_num=EXCLUDED.price_num,updated_at=NOW() RETURNING id", fields)
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return resp(200, {'success': True, 'id': new_id})

            elif action == 'admin_delete_price':
                cur.execute(f"DELETE FROM {SCHEMA}.service_prices WHERE id=%s", (body.get('id'),))
                conn.commit()
                return resp(200, {'success': True})

            elif action == 'admin_bulk_import_prices':
                items = body.get('items', [])
                count = 0
                for item in items:
                    try:
                        cur.execute(
                            f"INSERT INTO {SCHEMA}.service_prices (brand_slug,brand_name,model_slug,model_name,service_name,price_text,price_num,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (brand_slug,model_slug,service_name) DO UPDATE SET price_text=EXCLUDED.price_text,price_num=EXCLUDED.price_num,updated_at=NOW()",
                            (item.get('brand_slug'), item.get('brand_name'), item.get('model_slug'), item.get('model_name'), item.get('service_name'), item.get('price_text'), int(item.get('price_num', 0)), int(item.get('sort_order', 0)))
                        )
                        count += 1
                    except Exception:
                        pass
                conn.commit()
                return resp(200, {'success': True, 'imported': count})

            # ── Список заказов с полным поиском ──────────────────────────
            elif action == 'admin_search_orders':
                q = body.get('query', '').strip()
                status_filter = body.get('status', '')
                limit = int(body.get('limit', 50))
                conditions = []
                args = []
                if q:
                    conditions.append("(client_name ILIKE %s OR client_phone ILIKE %s OR order_number ILIKE %s OR device_brand ILIKE %s OR device_model ILIKE %s)")
                    args += [f'%{q}%', f'%{q}%', f'%{q}%', f'%{q}%', f'%{q}%']
                if status_filter:
                    conditions.append("status=%s")
                    args.append(status_filter)
                where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
                cur.execute(
                    f"""SELECT order_number, client_name, client_phone, device_brand, device_model, service_name, service_price, status, bonus_earned, created_at, comment
                    FROM {SCHEMA}.repair_orders {where} ORDER BY created_at DESC LIMIT %s""",
                    args + [limit]
                )
                orders = [{
                    'order_number': r[0], 'client_name': r[1], 'client_phone': r[2],
                    'device_brand': r[3], 'device_model': r[4], 'service_name': r[5],
                    'service_price': r[6], 'status': r[7], 'bonus_earned': r[8],
                    'created_at': r[9].isoformat() if r[9] else None, 'comment': r[10],
                } for r in cur.fetchall()]
                return resp(200, {'orders': orders, 'total': len(orders)})

        return resp(400, {'error': 'unknown action'})
    finally:
        cur.close()
        conn.close()