from flask import Flask, render_template, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt 
from flask_login import LoginManager, current_user 
#from flask_socketio import SocketIO
from flask_cors import CORS
import os
import requests
import boto3

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
    print('DEV_MODE')
except:  
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['DEBUG'] = False   
    AWS_SECRET_ACCESS_KEY =  os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_ACCESS_KEY_ID =  os.environ.get('AWS_ACCESS_KEY_ID')


s3_resource = boto3.resource('s3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

s3_client = boto3.client('s3',
         aws_access_key_id=AWS_ACCESS_KEY_ID,
         aws_secret_access_key= AWS_SECRET_ACCESS_KEY)


db = SQLAlchemy(app)
bcrypt = Bcrypt()
login = LoginManager(app)

#socketio = SocketIO(app, manage_session=False)

#@login.user_loader
#def load_user(id):
    #return User.query.get(int(id))

## see documentation
## every api call with the prefix /api/ will be accepted cross platfrom
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


from routes import *


if __name__ == '__main__': 
    #socketio.run(app)
    app.run()
        