"""
Административная панель: управление клиентами, начисление/списание бонусов,
добавление клиентов вручную, просмотр всех заявок.
Доступ только по секретному ADMIN_TOKEN.
"""
import json
import os
from datetime import datetime
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35950310_project_zenith_2127')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'ipro_admin_2026_secret')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def check_admin(event):
    token = (event.get('headers') or {}).get('X-Admin-Token', '')
    return token == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not check_admin(event):
        return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    action = body.get('action') or params.get('action', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Список всех клиентов
        if action == 'list_clients':
            search = body.get('search', '') or params.get('search', '')
            limit = int(params.get('limit', 50))
            offset = int(params.get('offset', 0))

            if search:
                cur.execute(
                    f"""SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, created_at
                    FROM {SCHEMA}.clients
                    WHERE phone ILIKE %s OR name ILIKE %s OR email ILIKE %s
                    ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                    (f'%{search}%', f'%{search}%', f'%{search}%', limit, offset)
                )
            else:
                cur.execute(
                    f"""SELECT id, phone, name, email, bonus_balance, loyalty_level, visits_count, total_spent, created_at
                    FROM {SCHEMA}.clients ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                    (limit, offset)
                )
            rows = cur.fetchall()
            clients = []
            for r in rows:
                clients.append({
                    'id': r[0], 'phone': r[1], 'name': r[2], 'email': r[3],
                    'bonus_balance': r[4] or 0, 'loyalty_level': r[5] or 'standard',
                    'visits_count': r[6] or 0, 'total_spent': r[7] or 0,
                    'created_at': r[8].isoformat() if r[8] else None,
                })
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients")
            total = cur.fetchone()[0]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'clients': clients, 'total': total})}

        # Добавить клиента вручную
        elif action == 'add_client':
            phone = body.get('phone', '').strip()
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            bonus_balance = int(body.get('bonus_balance', 0))
            loyalty_level = body.get('loyalty_level', 'standard')

            if not phone:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'phone required'})}

            cur.execute(
                f"""INSERT INTO {SCHEMA}.clients (phone, name, email, bonus_balance, loyalty_level)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (phone) DO UPDATE SET name=EXCLUDED.name, email=EXCLUDED.email, updated_at=NOW()
                RETURNING id""",
                (phone, name or None, email or None, bonus_balance, loyalty_level)
            )
            client_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True, 'client_id': client_id})}

        # Начислить/списать бонусы
        elif action == 'adjust_bonus':
            client_id = body.get('client_id')
            amount = int(body.get('amount', 0))
            description = body.get('description', 'Ручное начисление администратором')
            tx_type = 'earn' if amount > 0 else 'spend'

            if not client_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'client_id required'})}

            cur.execute(
                f"UPDATE {SCHEMA}.clients SET bonus_balance=bonus_balance+%s, updated_at=NOW() WHERE id=%s RETURNING bonus_balance",
                (amount, client_id)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'client not found'})}

            new_balance = row[0]
            cur.execute(
                f"INSERT INTO {SCHEMA}.bonus_transactions (client_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                (client_id, tx_type, abs(amount), description)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True, 'new_balance': new_balance})}

        # Подтвердить бонусы по заявке (после реального прихода клиента)
        elif action == 'confirm_order_bonus':
            order_number = body.get('order_number', '')
            cur.execute(
                f"SELECT id, client_id, service_price, status FROM {SCHEMA}.repair_orders WHERE order_number=%s",
                (order_number,)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'order not found'})}

            order_id, client_id, price, status = row
            if status == 'completed':
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'already confirmed'})}

            # Начисляем бонусы только после реального завершения
            bonus = int((price or 0) * 0.05)
            cur.execute(
                f"UPDATE {SCHEMA}.repair_orders SET status='completed', bonus_earned=%s, updated_at=NOW() WHERE id=%s",
                (bonus, order_id)
            )
            if client_id and bonus > 0:
                cur.execute(
                    f"UPDATE {SCHEMA}.clients SET bonus_balance=bonus_balance+%s, visits_count=visits_count+1, updated_at=NOW() WHERE id=%s",
                    (bonus, client_id)
                )
                cur.execute(
                    f"INSERT INTO {SCHEMA}.bonus_transactions (client_id, order_id, type, amount, description) VALUES (%s, %s, %s, %s, %s)",
                    (client_id, order_id, 'earn', bonus, f'Начислено за выполненный ремонт {order_number}')
                )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True, 'bonus_earned': bonus})}

        # Список всех заявок
        elif action == 'list_orders':
            limit = int(params.get('limit', 50))
            offset = int(params.get('offset', 0))
            status_filter = params.get('status', '')

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
            rows = cur.fetchall()
            orders = []
            for r in rows:
                orders.append({
                    'order_number': r[0], 'client_name': r[1], 'client_phone': r[2],
                    'device_brand': r[3], 'device_model': r[4], 'service_name': r[5],
                    'service_price': r[6], 'status': r[7], 'bonus_earned': r[8],
                    'created_at': r[9].isoformat() if r[9] else None,
                })
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders")
            total = cur.fetchone()[0]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders, 'total': total})}

        # Обновить статус заявки
        elif action == 'update_order_status':
            order_number = body.get('order_number', '')
            new_status = body.get('status', '')
            allowed = ['received', 'diagnostics', 'repair', 'ready', 'completed']
            if new_status not in allowed:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'invalid status'})}

            cur.execute(
                f"UPDATE {SCHEMA}.repair_orders SET status=%s, updated_at=NOW() WHERE order_number=%s",
                (new_status, order_number)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

        # Редактировать клиента
        elif action == 'update_client':
            client_id = body.get('client_id')
            name = body.get('name')
            email = body.get('email')
            loyalty_level = body.get('loyalty_level')
            phone = body.get('phone')

            cur.execute(
                f"UPDATE {SCHEMA}.clients SET name=%s, email=%s, loyalty_level=%s, phone=%s, updated_at=NOW() WHERE id=%s",
                (name, email, loyalty_level, phone, client_id)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

        # Статистика
        elif action == 'stats':
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.clients")
            total_clients = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders")
            total_orders = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.repair_orders WHERE status='received'")
            new_orders = cur.fetchone()[0]
            cur.execute(f"SELECT COALESCE(SUM(service_price),0) FROM {SCHEMA}.repair_orders WHERE status='completed'")
            total_revenue = cur.fetchone()[0]
            cur.execute(f"SELECT COALESCE(SUM(bonus_balance),0) FROM {SCHEMA}.clients")
            total_bonuses = cur.fetchone()[0]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'total_clients': total_clients,
                'total_orders': total_orders,
                'new_orders': new_orders,
                'total_revenue': int(total_revenue or 0),
                'total_bonuses': int(total_bonuses or 0),
            })}

        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'unknown action'})}

    finally:
        cur.close()
        conn.close()
