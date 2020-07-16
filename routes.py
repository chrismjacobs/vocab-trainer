import boto3
import random
from random import randint
import ast
import json
import requests
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, jsonify, render_template, request  
from run import app, db, bcrypt, s3_resource
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from pprint import pprint
from models import *


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        print('request 8080')
        return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")

def token_required(f):
    #https://stackabuse.com/single-page-apps-with-vue-js-and-flask-jwt-authentication/
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()

        invalid_msg = {
            'message': 'Invalid token. Registeration and / or authentication required',
            'authenticated': False
        }
        expired_msg = {
            'message': 'Expired token. Reauthentication required.',
            'authenticated': False
        }

        if len(auth_headers) != 2:
            return jsonify(invalid_msg), 401

        try:
            token = auth_headers[1]
            data = jwt.decode(token, app.config['SECRET_KEY'])
            user = User.query.filter_by(studentID=data['sub']).first()
            if not user:
                raise RuntimeError('User not found')
            return f(user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify(expired_msg), 401 # 401 is Unauthorized HTTP status code
        except (jwt.InvalidTokenError, Exception) as e:
            print(e)
            return jsonify(invalid_msg), 401

    return _verify

@app.route('/api/random')
@token_required
def random_number():
    response = { 
        'randomNumber' : randint(1,100)
    }
    return jsonify(response)


@app.route("/api/login", methods=['POST'])
def login(): 
    print('LOGIN')
    data = request.get_json()  
    pprint(data)      

    user = User.authenticate(**data)

    if not user:
        print('INVALID')
        return jsonify({ 'message': 'Invalid credentials', 'authenticated': False }), 401     

    token = jwt.encode({
        'sub': user.studentID,
        'iat':datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=30)},
        app.config['SECRET_KEY'])
    print(token)
    return jsonify({ 'token': token.decode('UTF-8'), 'msg' : 'Welcome ' + user.username + ', you have been logged in.'})

     
@app.route("/api/logout", methods=['POST'])
def logout():     
    return True


@app.route("/api/register", methods=['POST']) #and now the form accepts the submit POST
def register():
    print('REGISTER')
    data = request.get_json()  
    pprint(data)    
    
    sID = User.query.filter_by(studentID=data['studentID']).first()
    name = User.query.filter_by(username=data['username']).first()
    email = User.query.filter_by(email=data['email']).first()
    
    if name:
        return jsonify({'error' : 'name'})
    if sID:
        return jsonify({'error' : 'studentID'})
    if email:
        return jsonify({'error' : 'email'})    
                
    jstring = json.dumps('{}')
    bucket_name = 'lms-tester'
    classroom = '1'
    file_name = "jfolder/" + data['username'] + '.json'
        
    s3_resource.Bucket(bucket_name).put_object(Key=file_name, Body=str(jstring))
        
    jocation = "https://lms-tester.s3-ap-northeast-1.amazonaws.com/" + file_name   
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], studentID = data['studentID'], email=data['email'], password=hashed_password, jocation=jocation, school=data['school'])
    
    db.session.add(user)
    db.session.commit()      
    

    response = {
        'msg' : 'Welcome ' + data['username'] + ', you have been logged in.'
    }
    return jsonify(response)

 

def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request', 
                sender='chrisflask0212@gmail.com', 
                recipients=[user.email])
    msg.body = f'''To reset your password, visit the following link:
    {url_for('reset_token', token=token, _external=True)}
    If you did not request this email then please ignore'''
    #jinja2 template can be used to make more complex emails
    mail.send(msg)


@app.route("/reset_password")
def reset_request():  
    data = request.get_json() 
    email = data['email']
    user = User.query.filter_by(email=email).first()
    send_reset_email(user)
    return True
    

@app.route("/reset_password/<token>")
def reset_token(token):       
    if current_user.is_authenticated:
        return True
    user = User.verify_reset_token(token)
    if user is None:  
        #flash('That is an invalid or expired token', 'warning')
        return False
    
    hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
    user.password = hashed_password
    db.session.commit()
    #flash('Your password has been updated, please login', 'success') 
    return True


    