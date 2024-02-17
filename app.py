from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO #https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent/page/12
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
import os
import requests
import boto3
from urllib.parse import urlparse
import redis
import logging

logger = logging.getLogger("exchange bot")
handler = logging.StreamHandler()
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
logger.debug('Test Logger App')


##gunicorn==19.9.0
##web: gunicorn run (py file):app (flask name)
app = Flask(__name__,
        static_folder = "dist/static",
        instance_relative_config=True,
        template_folder = "dist"
        )

# print(app.template_folder)  --> PRINT dist
try:
    import config
    app.config.from_object('config.BaseConfig')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    AWS_ACCESS_KEY_ID = config.BaseConfig.AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = config.BaseConfig.AWS_SECRET_ACCESS_KEY
    MAIL_PASSWORD = config.BaseConfig.MAIL_PASSWORD,
    REDIS_PASSWORD = config.BaseConfig.REDIS_PASSWORD
    REDIS_URL = config.BaseConfig.REDIS_URL
    DEBUG = True
    TESTING = True
    print('DEV_MODE')
except:
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    '''CRUCIAL SETTING of DB '''
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_ALT')

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['DEBUG'] = False
    AWS_SECRET_ACCESS_KEY =  os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_ACCESS_KEY_ID =  os.environ.get('AWS_ACCESS_KEY_ID')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD')
    REDIS_URL = os.environ.get('REDIS_URL')
    DEBUG = True
    TESTING = False

## https://pythonhosted.org/Flask-Mail/
app.config.update(dict(
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587, # 465
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = 'vocab1trainer@gmail.com',
    MAIL_PASSWORD = MAIL_PASSWORD,
    MAIL_SUPPRESS_SEND = False,
    MAIL_DEBUG = True,
    TESTING = False,
    DEBUG = DEBUG
))

mail = Mail(app)

s3_resource = boto3.resource('s3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

s3_client = boto3.client('s3',
         aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

client = boto3.client('sts', aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

response = client.get_session_token()

translate_client = boto3.client(
    service_name='translate',
    region_name='ap-northeast-1',
    use_ssl=True,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key= AWS_SECRET_ACCESS_KEY
    )

polly_client = boto3.Session(
    region_name='ap-northeast-1',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key= AWS_SECRET_ACCESS_KEY
    ).client('polly')

# redisData = redis.Redis(
#     host = REDIS_URL,
#     port = 22960,
#     password = REDIS_PASSWORD,
#     decode_responses = True # get python freiendlt format
# )

url = urlparse(REDIS_URL)

# redisData = redis.Redis(host=url.hostname, port=url.port, password=url.password, ssl=True, ssl_cert_reqs=None, decode_responses = True) # get python freiendlt format)

if REDIS_URL:
    if TESTING:
        redisData = redis.from_url(REDIS_URL, ssl_cert_reqs=None, decode_responses=True)
    else:
        ## For Render URL
        redisData = redis.from_url(REDIS_URL, decode_responses=True)


print(redisData)
redisData.set('start', 'done')
print(redisData.get('start'))


db = SQLAlchemy(app)
bcrypt = Bcrypt()

socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

print('SOCKET', socketio)

## see documentation
## every api call with the prefix /api/ will be accepted cross platfrom
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

from routes import *
from sockets import *


if __name__ == '__main__':
    # port=8080
    host='0.0.0.0'
    socketio.run(app, host=host, debug=DEBUG)
    #app.run()
