from flask import Flask, jsonify, request, current_app
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
import os
import json
import logging
from datetime import datetime, timedelta

# ---- Logging
logger = logging.getLogger("app")
handler = logging.StreamHandler()
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
logger.debug('Starting Flask app')

# ---- Flags / Env
ENABLE_EXTERNALS = os.getenv("ENABLE_EXTERNALS", "1") == "1"
LOCAL = os.getenv("LOCAL", "1") == "1"

# ---- Flask
app = Flask(
    __name__,
    static_folder="dist/static",
    instance_relative_config=True,
    template_folder="dist",
)

# ---- Config
try:
    import config
    app.config.from_object("config.BaseConfig")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True, "pool_recycle": 300}
    AWS_ACCESS_KEY_ID = config.BaseConfig.AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = config.BaseConfig.AWS_SECRET_ACCESS_KEY
    MAIL_PASSWORD = config.BaseConfig.MAIL_PASSWORD
    REDIS_URL = config.BaseConfig.REDIS_URL
    VAPID_PRIVATE_KEY = config.BaseConfig.VAPID_PRIVATE_KEY
    VAPID_PUBLIC_KEY = config.BaseConfig.VAPID_PUBLIC_KEY
    DEBUG = True
    TESTING = True
    LOCAL = True
    print("DEV_MODE (config module)")
except Exception as e:
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_ALT") or "sqlite:///app.db"
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    REDIS_URL = os.environ.get("REDIS_URL")
    VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY", "")
    VAPID_PUBLIC_KEY = os.environ.get("VAPID_PUBLIC_KEY", "")
    DEBUG = True
    TESTING = True
    LOCAL = True
    print("DEV_MODE (env) - using safe defaults", e)

# ---- Mail
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME="vocab1trainer@gmail.com",
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_SUPPRESS_SEND=not ENABLE_EXTERNALS,
    MAIL_DEBUG=True,
    TESTING=TESTING,
)
mail = Mail(app)

# ---- Optional externals
s3_resource = s3_client = translate_client = polly_client = None
redisData = None

if ENABLE_EXTERNALS:
    try:
        import boto3
        s3_resource = boto3.resource(
            "s3", aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        s3_client = boto3.client(
            "s3", aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        translate_client = boto3.client(
            "translate",
            region_name="ap-northeast-1",
            use_ssl=True,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
        polly_client = boto3.Session(
            region_name="ap-northeast-1",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        ).client("polly")
    except Exception as e:
        app.logger.exception("AWS init failed: %s", e)

    try:
        import redis
        if REDIS_URL:
            redisData = redis.from_url(REDIS_URL, decode_responses=True)
            print("Redis ping:", redisData.ping(), flush=True)
    except Exception as e:
        app.logger.exception("Redis init failed: %s", e)

# ---- DB / Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- Import routes/sockets
try:
    from routes import *   # noqa
    from sockets import *  # noqa
except Exception as e:
    app.logger.warning("Custom routes/sockets not loaded: %s", e)

# ---- Daily push notification scheduler
def get_weekly_word_count(user_id):
    try:
        rData = redisData.hgetall(user_id)
        logs = json.loads(rData.get('logs', '{}')).get('logs', {})
        one_week_ago = datetime.now() - timedelta(days=7)
        total = 0
        for key, session in logs.items():
            if key == 'device':
                continue
            try:
                session_time = datetime.fromisoformat(str(key))
                if session_time > one_week_ago:
                    for data in session.values():
                        if isinstance(data, dict) and 'words' in data:
                            total += data.get('words', 0)
            except (ValueError, TypeError):
                continue
        return total
    except Exception:
        return 0

def send_daily_notifications():
    if not redisData or not VAPID_PRIVATE_KEY:
        return
    today = datetime.now().strftime('%Y-%m-%d')
    lock_key = 'notification_lock_' + today
    if not redisData.setnx(lock_key, 1):
        return
    redisData.expire(lock_key, 86400)

    from pywebpush import webpush, WebPushException
    subscriptions = redisData.hgetall('push_subscriptions')
    print(f"Sending daily notifications to {len(subscriptions)} subscribers", flush=True)
    for user_id, sub_json in subscriptions.items():
        try:
            count = get_weekly_word_count(user_id)
            body = f"You've practised {count} words this week. Keep it up!" if count > 0 else "Time to practise your vocab today!"
            webpush(
                subscription_info=json.loads(sub_json),
                data=json.dumps({'title': 'Vocab Trainer', 'body': body, 'url': '/'}),
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims={"sub": "mailto:vocab1trainer@gmail.com"}
            )
        except WebPushException as e:
            print(f"Push failed for {user_id}: {e}", flush=True)
            if '410' in str(e) or '404' in str(e):
                redisData.hdel('push_subscriptions', user_id)
        except Exception as e:
            print(f"Notification error for {user_id}: {e}", flush=True)

try:
    from apscheduler.schedulers.gevent import GeventScheduler
    scheduler = GeventScheduler()
    scheduler.add_job(send_daily_notifications, 'cron', hour=1, minute=0)  # 1am UTC = 9am UTC+8
    scheduler.start()
    print("Scheduler started", flush=True)
except Exception as e:
    app.logger.warning("Scheduler not started: %s", e)

# ---- Entrypoint
if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=DEBUG, use_reloader=False)
