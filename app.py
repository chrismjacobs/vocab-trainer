from flask import Flask, jsonify, request, current_app
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
import os
import logging
from urllib.parse import urlparse

# ---- Logging
logger = logging.getLogger("app")
handler = logging.StreamHandler()
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
logger.debug('Starting Flask app')

# ---- Flags / Env
ENABLE_EXTERNALS = os.getenv("ENABLE_EXTERNALS", "1") == "1"  # flip to 1 to enable AWS/Redis locally
LOCAL = os.getenv("LOCAL", "1") == "1"  # assume local dev by default

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
    DEBUG = True
    TESTING = True
    LOCAL = True
    print("DEV_MODE (config module)")
except Exception as e:
    # Minimal safe defaults for local dev
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
    # DB: use provided env or fallback to sqlite for local
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_ALT") or "sqlite:///app.db"
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    REDIS_URL = os.environ.get("REDIS_URL")
    DEBUG = True
    TESTING = True
    LOCAL = True
    print("DEV_MODE (env) - using safe defaults", e)

# ---- Mail (safe in dev)
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME="vocab1trainer@gmail.com",
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_SUPPRESS_SEND=not ENABLE_EXTERNALS,  # don't actually send in local unless told to
    MAIL_DEBUG=True,
    TESTING=TESTING,
)
mail = Mail(app)

# ---- Optional externals (guarded)
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
        # Avoid sts.get_session_token() in dev; often requires MFA and can block
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
        current_app.logger.exception("AWS init failed: %s", e)

    try:
        import redis

        if REDIS_URL:
            url = urlparse(REDIS_URL)
            # If your REDIS_URL is rediss:// require ssl_cert_reqs=None for dev
            redisData = redis.from_url(
                REDIS_URL,
                ssl_cert_reqs=None if url.scheme == "rediss" else None,
                decode_responses=True,
            )
            print("Redis ping:", redisData.ping(), flush=True)
    except Exception as e:
        current_app.logger.exception("Redis init failed: %s", e)

# ---- DB / Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- Import your real routes/sockets (keep after app is created)
try:
    from routes import *   # noqa
    from sockets import *  # noqa
except Exception as e:
    # We are at import time, outside an application/request context,
    # so use the app's logger directly instead of current_app.
    app.logger.warning("Custom routes/sockets not loaded: %s", e)

# ---- Entrypoint
if __name__ == "__main__":
    # Bind explicitly for your dev proxy
    socketio.run(app, host="127.0.0.1", port=5000, debug=DEBUG, use_reloader=False)
