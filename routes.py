import boto3
import random
from random import randint
import ast
import json
import requests
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import jsonify, render_template, request
from app import app, db, bcrypt, s3_resource
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
    print('Number')
    response = {
        'randomNumber' : randint(1,100)
    }
    return jsonify(response)

@app.route('/api/updateRecord', methods=['POST'])
def update_record():
    print('UPDATE')
    payload = request.get_json()
    pprint(payload)

    token = payload['jwt']
    data = jwt.decode(token, app.config['SECRET_KEY'])
    user = User.query.get(data['sub'])

    key = "jfolder/" + str(user.id) + '/settings.json'
    content_object = s3_resource.Object( 'vocab-lms', key)
    file_content = content_object.get()['Body'].read().decode('utf-8')
    print(file_content)
    print(json.dumps({}))
    userSettings = json.loads(json.dumps({}))
    print(type(userSettings), userSettings)
    for key in payload['settings']:
        print(key)
        if key in userSettings:
            userSettings[key] += 1
        else:
            userSettings[key] = 1
        entry = Settings.query.filter_by(settings=key).first()
        if entry:
            entry.count += 1
        else:
            entry = Settings(settings=key, count=1)
            db.session.add(entry)
            db.session.commit()

    bucket_name = 'vocab-lms'

    jstring1 = json.dumps(userSettings)
    file_name1 = "jfolder/" + str(user.id) +  '/settings.json'
    s3_resource.Bucket(bucket_name).put_object(Key=file_name1, Body=str(jstring1))

    jstring2 = json.dumps(payload['userRecord'])
    file_name2 = "jfolder/" + str(user.id) +  '/records.json'
    s3_resource.Bucket(bucket_name).put_object(Key=file_name2, Body=str(jstring2))

    response = {
        'msg' : 'success'
    }
    return jsonify(response)


@app.route("/api/login", methods=['POST'])
def login():
    print('LOGIN')
    data = request.get_json()
    pprint(data)

    user = authenticate(**data)

    if not user:
        print('INVALID')
        return jsonify({ 'msg': 'Invalid credentials', 'authenticated': False }), 401

    key = "jfolder/" + str(user.id) + '/records.json'
    content_object = s3_resource.Object( 'vocab-lms', key )
    file_content = content_object.get()['Body'].read().decode('utf-8')
    userRecord = json.loads(file_content)
    print(userRecord)

    userProfile = {
        'username' : user.username,
        'userID' : user.id,
        'studentID' : user.studentID,
        'image' : user.image_file,
        'school' : user.school,
        'email' : user.email,
        'classroom' : user.classroom,
        'vocab' : user.vocab
    }

    token = jwt.encode({
        'sub': user.id,
        'iat':datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=240)},
        app.config['SECRET_KEY'])
    print(token)

    return jsonify({
        'token': token.decode('UTF-8'),
        'msg': 'Welcome ' + user.username + ', you have been logged in.',
        'userProfile': userProfile,
        'userRecord': userRecord
        })


@app.route("/api/register", methods=['POST']) #and now the form accepts the submit POST
def register():
    print('REGISTER')
    data = request.get_json()['userData']
    pprint(data)

    name = User.query.filter_by(username=data['username']).first()
    email = User.query.filter_by(email=data['email']).first()

    if name:
        print('NAME ERROR')
        return jsonify({'msg' : 'This name has been used already.', 'err': 1})
    if email:
        print('EMAIL ERROR')
        return jsonify({'msg' : 'This email has been used already.', 'err': 1})


    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    newUser = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(newUser)
    db.session.commit()

    user = User.query.filter_by(username=data['username']).first()

    jstring = json.dumps({})
    bucket_name = 'vocab-lms'
    file_name1 = "jfolder/" + str(user.id) +  '/records.json'
    file_name2 = "jfolder/" + str(user.id) +  '/settings.json'

    s3_resource.Bucket(bucket_name).put_object(Key=file_name1, Body=str(jstring))
    s3_resource.Bucket(bucket_name).put_object(Key=file_name2, Body=str(jstring))



    response = {
        'msg' : 'Hi ' + data['username'] + ', you have been registered. Please log in to continue'
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


