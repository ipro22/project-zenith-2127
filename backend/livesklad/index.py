"""
Прокси для LiveSklad API — проверка статуса заказа по номеру.
"""
import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        api_key = os.environ.get("LIVESKLAD_API_KEY", "jjBMBhbeTaVfnHkD2YMU")

        params = event.get("queryStringParameters") or {}
        order_id = params.get("order_id", "").strip()

        if not order_id:
            return {
                "statusCode": 400,
                "headers": cors,
                "body": {"error": "order_id обязателен"},
            }

        url = f"https://api.livesklad.com/v1/orders/{urllib.parse.quote(order_id)}"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            return {
                "statusCode": e.code,
                "headers": cors,
                "body": json.dumps({"error": f"LiveSklad вернул {e.code}", "detail": body}, ensure_ascii=False),
            }

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "order": data}, ensure_ascii=False),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors,
            "body": json.dumps({"error": str(e)}, ensure_ascii=False),
        }