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

    content = jChecker(user, True, True, True)

    userRecord = content['userRecord']
    logsRecord = content['logsRecord']
    dictRecord = content['dictRecord']


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
        'logsRecord': logsRecord,
        'dictRecord': dictRecord
        })

@app.route("/api/getRecord", methods=['POST'])
def get_records():
    print('RECORDS')
    userID = request.get_json()['userID']
    user = User.query.get(userID)

    content = jChecker(user, True, True, True)
    userRecord = content['userRecord']
    dictRecord = content['dictRecord']
    logsRecord = content['logsRecord']
    logsRecord['logs'] = {'time': datetime.utcnow()}

    return jsonify({
        'userRecord': userRecord,
        'logsRecord': logsRecord,
        'dictRecord': dictRecord
        })

@app.route('/api/updateRecord', methods=['POST'])
def update_record():
    print('UPDATE')
    payload = request.get_json()
    pprint(payload)

    userRecord = payload['userRecord']
    dictRecord = payload['dictRecord']
    newLogsRecord = payload['logsRecord']

    userID = payload['userID']
    user = User.query.get(userID)

    content = jChecker(user, False, True, False)

    # {'vocab_content': '{}', 'logs_content': '{"friends": [], "settings": {}, "logs": []}', 'dictionary_content': None}
    historyLogsRecord = content['logsRecord']
    print(type(content['logsRecord']), content['logsRecord'])
    ## update logs
    historyLogsRecord['settings'] = newLogsRecord['settings']
    historyLogsRecord['logs'].append(newLogsRecord['logs'])

    jStorer(user, historyLogsRecord, userRecord, dictRecord)

    print('updateRecord', user)

    response = {
        'msg' : 'success'
    }
    return jsonify(response)


@app.route('/api/checkFriend', methods=['POST'])
def checkFriend():
    print('FRIEND')
    payload = request.get_json()
    pprint(payload)
    username = payload['username']
    userID = payload['userID']

    print(username)
    print(userID)

    user = User.query.get(userID)

    print(user)

    check = True

    if user:
        checkName1 = (username.lower()).strip()
        checkName2 = (user.username.lower()).strip()
        print(checkName1, checkName2)
        if checkName1 != checkName2:
            check = False
    else:
        check = False

    response = {
        'check' : check,
        'username' : user.username,
        'userID': userID
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

@app.route("/api/addImage", methods=['POST']) #and now the form accepts the submit POST
def addImage():
    print('IMAGE')
    userID = request.get_json()['userID']

    vocab = request.get_json()['vocab']
    word = request.get_json()['word']
    mode = [word['word'], vocab]

    print(vocab, word['word'], mode)

    try:
        stringData = request.get_json()['imageData']
        imageData = json.loads(stringData)
        storeB64(imageData, userID, mode)
    except:
        pass

    response = {
        'msg' : 'Your image has been added'
    }
    return jsonify(response)

def storeB64(fileData, uid, mode):
    user = User.query.get(uid)

    if fileData['image64'] and mode == 'profile':
        link = 'profileLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/'
        filename = location + 'avatar' + fileType
    elif fileData['image64']:
        print(mode)
        word = mode[0]
        vocab = mode[1]
        link = 'dictionaryLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/' + vocab + '/'
        filename = location + word + fileType

    ## if want to delete old file
    '''
    if filename:
        print('filename_found ', filename)
        s3_resource.Object(bucket_name, filename).delete()
    else:
        print('no file_key found')
    '''

    print('PROCESSING: ' + link)
    data = base64.b64decode(b64data)
    s3_resource.Bucket(bucket_name).put_object(Key=filename, Body=data)

    return filename

''' ############ json handlers ############'''

def jChecker(user, vocab, logs, dictionary):

    vocab_content = json.dumps({})
    logs_content = json.dumps({})
    dictionary_content = json.dumps({})

    if vocab:
        vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
        try:
            content_object = s3_resource.Object( 'vocab-lms', vocabKey )
            vocab_content = content_object.get()['Body'].read().decode('utf-8')
        except:
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
            s3_resource.Bucket(bucket_name).put_object(Key=dictionaryKey, Body=str(dictionary_content))

    print(type(json.loads(logs_content)), type(json.loads(dictionary_content)))

    return {'userRecord': json.loads(vocab_content), 'logsRecord': json.loads(logs_content), 'dictRecord': json.loads(dictionary_content)}


def jStorer(user, logsRecord, userRecord, userDictionary):
    vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
    dictionaryKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/dictionary.json'
    logsKey = "jfolder/" + str(user.id) + '/logs.json'

    if logsRecord:
        print('logs stored')
        logs_content = json.dumps(logsRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=logsKey, Body=str(logs_content))

    if userRecord:
        print('vocab stored')
        vocab_content = json.dumps(userRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=vocabKey, Body=str(vocab_content))

    if userDictionary:
        print('dict stored')
        dictionary_content = json.dumps(userDictionary)
        s3_resource.Bucket(bucket_name).put_object(Key=dictionaryKey, Body=str(dictionary_content))

    return True

''' ########## email feature ###########'''



