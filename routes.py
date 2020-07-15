import boto3
import random
from random import randint
from datetime import datetime, timedelta
import ast
import json
from flask import jsonify  
from run import app, db
from flask_login import current_user, login_required
from pprint import pprint
from models import *


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        print('request 8080')
        return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")

@app.route('/api/random')
def random_number():
    response = { 
        'randomNumber' : randint(1,100)
    }
    return jsonify(response)