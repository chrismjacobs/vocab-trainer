from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt 
from flask_login import LoginManager, current_user 
from flask_socketio import SocketIO
from flask_cors import CORS
from random import *
import os
import requests


##gunicorn==19.9.0
##web: gunicorn run (py file):app (flask name) 
app = Flask(__name__, 
        static_folder = "dist/static",          
        instance_relative_config=True,
        template_folder = "dist"       
        )

db = SQLAlchemy(app)
bcrypt = Bcrypt()
login = LoginManager(app)
#login.login_view = 'login' # if user isn't logged in it will redirect to login page
#login.login_message_category = 'info'

socketio = SocketIO(app, manage_session=False)

#@login.user_loader
#def load_user(id):
    #return User.query.get(int(id))

  
SECRET_KEY = os.environ.get('SECRET_KEY')

## see documentation
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

print(app.template_folder)
try:
    import devConfig
    app.config.from_object('devConfig.KEYS')
except:
    class KEYS():
        SECRET_KEY = os.environ.get('SECRET_KEY')    
        SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
        DEBUG = False    
    app.config.from_object('KEYS')


@app.route('/api/random')
def random_number():
    response = { 
        'randomNumber' : randint(1,100)
    }
    return jsonify(response)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")


if __name__ == '__main__': 
    #socketio.run(app)
    app.run()
        