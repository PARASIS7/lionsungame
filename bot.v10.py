"""Minimal Telegram bot that opens the Lion & Sun Mini App."""

import json
import os
import time
import urllib.parse
import urllib.request


TOKEN = os.environ["BOT_TOKEN"]
MINI_APP_URL = os.environ["MINI_APP_URL"].rstrip("/")
API = f"https://api.telegram.org/bot{TOKEN}/"


def call(method: str, payload: dict | None = None) -> dict:
    data = urllib.parse.urlencode(payload or {}).encode()
    with urllib.request.urlopen(API + method, data=data, timeout=70) as response:
        result = json.load(response)
    if not result.get("ok"):
        raise RuntimeError(result)
    return result


def configure() -> None:
    menu = {"type": "web_app", "text": "اجرای بازی", "web_app": {"url": MINI_APP_URL}}
    call("setChatMenuButton", {"menu_button": json.dumps(menu, ensure_ascii=False)})
    call("setMyCommands", {"commands": json.dumps([{"command": "start", "description": "اجرای بازی"}], ensure_ascii=False)})


def send_launcher(chat_id: int) -> None:
    keyboard = {"inline_keyboard": [[{"text": "🦁 اجرای شیر و خورشید", "web_app": {"url": MINI_APP_URL}}]]}
    call("sendMessage", {
        "chat_id": chat_id,
        "text": "برای ورود به بازی روی دکمه زیر بزنید. نمایش مناسب دستگاه شما به‌صورت خودکار انتخاب می‌شود.",
        "reply_markup": json.dumps(keyboard, ensure_ascii=False),
    })


def main() -> None:
    configure()
    offset = 0
    while True:
        try:
            updates = call("getUpdates", {"offset": offset, "timeout": 55, "allowed_updates": json.dumps(["message"])})["result"]
            for update in updates:
                offset = update["update_id"] + 1
                message = update.get("message", {})
                text = message.get("text", "")
                if text.startswith("/start") and "chat" in message:
                    send_launcher(message["chat"]["id"])
        except Exception as error:
            print(f"Telegram polling error: {error}", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    main()
