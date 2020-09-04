import boto3
import random
import base64
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
from PIL import Image
bucket_name = 'vocab-lms'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if app.debug:
        print('request 8080')
        return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")


@app.route("/api/register", methods=['POST']) #and now the form accepts the submit POST
def register():
    print('REGISTER')
    data = request.get_json()['userData']
    pprint(data)

    email = (data['email'].lower()).strip()

    checkName = User.query.filter_by(username=data['username']).first()
    checkEmail = User.query.filter_by(email=email).first()

    if checkName:
        print('NAME ERROR')
        return jsonify({'msg' : 'This name has been used already.', 'err': 1})
    if checkEmail:
        print('EMAIL ERROR')
        return jsonify({'msg' : 'This email has been used already.', 'err': 1})


    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    newUser = User(username=data['username'], email=email, password=hashed_password)
    db.session.add(newUser)
    db.session.commit()

    user = User.query.filter_by(username=data['username']).first()

    response = {
        'msg' : 'Hi ' + data['username'] + ', you have been registered. Please log in to continue'
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

    content = jChecker(user, True, True, False)

    userRecord = content['userRecord']
    logsRecord = content['logsRecord']


    logsRecord['logs'] = {'time': datetime.utcnow()}

    print(userRecord)
    print(logsRecord)

    userProfile = {
        'username' : user.username,
        'userID' : user.id,
        'studentID' : user.studentID,
        'school' : user.school,
        'email' : user.email,
        'classroom' : user.classroom,
        'vocab' : user.vocab
    }

    token = jwt.encode({
                'sub': user.id,
                'iat':datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(minutes=240)
                }, app.config['SECRET_KEY'])

    print(token)


    if user.vocab == 'general':
        msg = 'Welcome ' + user.username + ', please set up your account.'
        init = False
    else:
        msg = 'Welcome ' + user.username + ', you have been logged in.'
        init = True

    return jsonify({
        'token': token.decode('UTF-8'),
        'msg': msg,
        'init': init,
        'userProfile': userProfile,
        'userRecord': userRecord,
        'logsRecord': logsRecord
        })

@app.route('/api/updateRecord', methods=['POST'])
def update_record():
    print('UPDATE')
    payload = request.get_json()
    pprint(payload)

    userRecord = payload['userRecord']
    newLogsRecord = payload['logsRecord']

    userID = payload['userID']
    user = User.query.get(userID)

    content = jChecker(user, True, True, False)
    print(content)
    # {'vocab_content': '{}', 'logs_content': '{"friends": [], "settings": {}, "logs": []}', 'dictionary_content': None}
    historyLogsRecord = content['logsRecord']

    ## update logs
    historyLogsRecord['settings'] = newLogsRecord['settings']
    historyLogsRecord['logs'].append(newLogsRecord['logs'])

    jStorer(user, historyLogsRecord, userRecord, None)

    response = {
        'msg' : 'success'
    }
    return jsonify(response)


@app.route('/api/updateFriends', methods=['POST'])
def update_friends():
    print('FRIENDS')
    payload = request.get_json()
    pprint(payload)

    friends = payload['logsRecord']['friends']
    print(friends, type(friends))

    userID = payload['userID']
    user = User.query.get(userID)

    #jChecker(user, vocab, logs, dictionary)
    content = jChecker(user, False, True, False)

    # {'vocab_content': '{}', 'logs_content': '{"friends": [], "settings": {}, "logs": []}', 'dictionary_content': None}
    logsRecord = content['logsRecord']

    ## update logs
    logsRecord['friends'] = friends

    jStorer(user, logsRecord, None, None)

    response = {
        'msg' : 'success'
    }
    return jsonify(response)


@app.route("/api/updateAccount", methods=['POST']) #and now the form accepts the submit POST
def updateAccount():
    print('ACCOUNT')
    data = request.get_json()['userData']
    pprint(data)
    if data['imageData']:
        storeB64(data['imageData'], data['userID'], 'profile')

    current_user = User.query.get(data['userID'])

    newVocab = False
    if current_user.vocab != data['vocab']:
        newVocab = True

    current_user.classroom = data['classroom']
    current_user.studentID = data['studentID']
    current_user.vocab = data['vocab']
    current_user.school = data['school']
    db.session.commit()

    response = {
        'msg' : 'Thank you ' + data['username'] + ', your account information has been changed',
        'dataReturn' : data,
        'newVocab' : newVocab
    }
    return jsonify(response)

def storeB64(fileData, uid, mode):

    if fileData['image64'] and mode == 'profile':
        link = 'profileLink'
        b64data = fileData['image64']
        fileType = 'jpg'
        location = 'public/profiles/'

    ## if want to delete old file
    filename = location + str(uid) + '.' + fileType
    if filename:
        print('filename_found ', filename)
        s3_resource.Object(bucket_name, filename).delete()
    else:
        print('no file_key found')


    print('PROCESSING: ' + link)
    data = base64.b64decode(b64data)
    s3_resource.Bucket(bucket_name).put_object(Key=filename, Body=data)

    return filename

''' ############ json handlers ############'''

def jChecker(user, vocab, logs, dictionary):

    vocab_content = '{}'
    logs_content = '{}'
    dictionary_content = '{}'

    if vocab:
        vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
        try:
            content_object = s3_resource.Object( 'vocab-lms', vocabKey )
            vocab_content = content_object.get()['Body'].read().decode('utf-8')
        except:
            vocab_content = json.dumps({})
            s3_resource.Bucket(bucket_name).put_object(Key=vocabKey, Body=str(vocab_content))

    if logs:
        logsKey = "jfolder/" + str(user.id) + '/logs.json'
        logs = {
            'friends': [],
            'settings': {},
            'logs': []
        }
        try:
            content_object = s3_resource.Object( 'vocab-lms', logsKey )
            logs_content = content_object.get()['Body'].read().decode('utf-8')
        except:
            logs_content = json.dumps(logs)
            s3_resource.Bucket(bucket_name).put_object(Key=logsKey, Body=str(logs_content))

    if dictionary:
        dictionaryKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/dictionary.json'
        try:
            content_object = s3_resource.Object( 'vocab-lms', dictionaryKey )
            dictionary_content = content_object.get()['Body'].read().decode('utf-8')
        except:
            dictionary_content = json.dumps(json.dumps({}))
            s3_resource.Bucket(bucket_name).put_object(Key=dictionaryKey, Body=str(dictionary_content))

    return {'userRecord': json.loads(vocab_content), 'logsRecord': json.loads(logs_content), 'dictRecord': json.loads(dictionary_content)}


def jStorer(user, logsRecord, userRecord, userDictionary):
    vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
    dictionaryKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/dictionary.json'
    logsKey = "jfolder/" + str(user.id) + '/logs.json'

    if logsRecord:
        logs_content = json.dumps(logsRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=logsKey, Body=str(logs_content))

    if userRecord:
        vocab_content = json.dumps(userRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=vocabKey, Body=str(vocab_content))

    if userDictionary:
        dictionary_content = json.dumps(userDictionary)
        s3_resource.Bucket(bucket_name).put_object(Key=dictionaryKey, Body=str(dictionary_content))

    return True

''' ########## email feature ###########'''



