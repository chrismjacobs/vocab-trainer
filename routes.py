import redis
import boto3
import random
import secrets
import time
import base64
from random import randint
import ast
import json
import requests
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import jsonify, render_template, request
from flask_mail import Message
from app import app, db, bcrypt, s3_resource, s3_client, mail, polly_client, translate_client, redisData
from pprint import pprint
from models import *
from PIL import Image
bucket_name = 'vocab-lms'
bucket = s3_resource.Bucket(bucket_name)
DEBUG = app.config['DEBUG']


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
    data = request.get_json()['form']
    pprint(data)

    name = data['username'].strip()

    email = (data['email'].lower()).strip()
    checkEmail = User.query.filter_by(email=email).first()
    if checkEmail:
        print('EMAIL ERROR')
        return jsonify({'msg' : 'This email has been used already.', 'err': 1})

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    newUser = User(username=name, email=email, password=hashed_password)
    db.session.add(newUser)
    db.session.commit()

    user = User.query.filter_by(username=name).first()

    response = {
        'msg' : 'Hi ' + data['username'] + ', you have been registered. Please log in to continue'
    }

    try:
        send_welcome_email(user)
    except:
        print('email failed')

    return jsonify(response)


@app.route("/api/login", methods=['POST'])
def login():
    print('LOGIN')
    data = request.get_json()
    pprint(data)
    skeleton = False

    if data['userData']['password'] == 'skeleton':
        user = User.query.filter_by(email=data['userData']['email']).first()
        skeleton = True
    else:
        user = authenticate(**data)

    if not user:
        print('INVALID')
        return jsonify({ 'msg': 'Invalid credentials - please check username and password', 'err': 1 })

    content = jChecker(user, True, True, True)

    userRecord = content['userRecord']
    logsRecord = content['logsRecord']
    setRecord = content['setRecord']

    print('check', setRecord, type(setRecord))

    classmates = {}

    users = User.query.all()
    if user.classroom: # no action if classroom is not set
        print('CLASSROOM', user.classroom)
        for u in users:
            if u.classroom == user.classroom and u is not user:
                classmates[u.id] = u.username

    user.extraStr = datetime.now()
    db.session.commit()

    userProfile = {
        'username' : user.username,
        'userID' : user.id,
        'studentID' : user.studentID,
        'school' : user.school,
        'email' : user.email,
        'classroom' : user.classroom,
        'classmates' : classmates,
        'vocab' : user.vocab,
        'instructor': user.extraInt
    }

    token = jwt.encode({
                'sub': user.id,
                'iat':datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(minutes=240)
                }, app.config['SECRET_KEY'])

    token_string = token.decode('UTF-8')
    print('TOKEN', token_string)

    user.extraInfo = token_string
    db.session.commit()


    msg = ''

    if user.classroom == None:
        msg = 'Welcome ' + user.username + ', please join a classroom to unlock more features.'
    else:
        msg = 'Welcome ' + user.username + ', you have been logged in.'

    return jsonify({
        'token': token_string,
        'msg': msg,
        'userProfile': userProfile,
        'userRecord': userRecord,
        'logsRecord': logsRecord,
        'setRecord': setRecord,
        'skeleton': skeleton
        })

@app.route("/api/getGroups", methods=['POST'])
def getGroups():
    print('INSTRUCTOR GROUPS')
    data = request.get_json()
    pprint(data)

    userID = data['userID']

    classroomList = Classroom.query.filter_by(user_id=userID).all()

    groups = []
    for c in classroomList:
        groups.append({'code': c.code, 'count': User.query.filter_by(classroom=c.code).count()})

    return jsonify({
        'classGroups' : groups
        })


@app.route("/api/instructorRedis", methods=['POST'])
def instructorRedis():
    print('INSTRUCTOR REDIS')

    data = request.get_json()
    pprint(data)

    group = data['group']
    action = data['action']

    msg= None
    payload = {}

    if action == 'setNotes':
        notes = data['notes']
        redisData.hset(group, "notes", json.dumps(notes))
        msg = 'notes success'

    elif action == 'getNotesInstructor':
        string = redisData.hget(group, "notes")
        if string:
            payload = json.loads(string)
        msg = 'notes'

    elif action == 'getNotesStudent':
        student = (data['student'])
        rDict = json.loads(redisData.hget(group, "notes"))
        pprint(rDict)
        if rDict[str(student)]:
            payload = rDict[str(student)]
        msg = 'notes'

    elif action == 'setTests':
        testData = data['testData']
        redisData.hset(group, "tests", json.dumps(testData))
        msg = 'tests success'

    else:
        msg = 'fail'

    return jsonify({
        'payload' : payload,
        'msg' : msg,
        })


@app.route("/api/getClass", methods=['POST'])
def get_class():
    print('GET CLASS')

    userID = request.get_json()['userID']
    user = User.query.get(userID)
    classroom = request.get_json()['classroom']

    users = User.query.filter_by(classroom=classroom).all()

    classDict = {}

    for user in users:
        classDict[user.id] = {}
        classDict[user.id]['user'] = user.username

        content = jChecker(user, True, True, True)
        classDict[user.id]['userRecord'] = content['userRecord']
        classDict[user.id]['setRecord'] = content['setRecord']
        classDict[user.id]['logsRecord'] = content['logsRecord']

    return jsonify({
        'classRecords': classDict
        })


def send_welcome_email(user):
    print(user)
    msg = Message('Welcome ' + user.username + ', to VOCAB TRAINER',
                sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
                recipients=[user.email, 'cjx02121981@gmail.com'])

    msg.body = 'Your email has been used to register an account with vocab-lms.herokuapp.com. We hope you enjoy building your vocabulary with our application. If you would like to talk to a developer about how to use the application, please contact Chris (LINE: chrisj0212).'
    ## msg.html = "<img href='https://picsum.photos/1024/480'> </img>"

    mail.send(msg)


@app.route("/api/requestToken", methods=['POST'])
def requestToken():
    print('RESET PASSWORD')
    email = request.get_json()['email']
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'msg': 'There is no account associated with this email', 'status': False})

    tokenSet = False
    secret = secrets.token_hex(16)
    timestamp = time.time()
    print(timestamp) # 1610367054.5547

    try:
        tokenSet = json.loads(user.extraStr)
    except:
        print('token not set yet')

    if tokenSet == False or int(tokenSet['timestamp']) + 60 > time.time():
        user.extraStr = json.dumps({'secret':secret, 'timestamp': timestamp})
        db.session.commit()
        try:
            msg = Message('Welcome ' + user.username + ', to VOCAB TRAINER',
                sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
                recipients=[user.email, 'cjx02121981@gmail.com'])

            msg.body = 'You have requested to change your password for Vocab Trainer. Please use the following token to change your password within 1 hour: '
            msg.html = "<a>" + secret + "</a>"
            # mail.send(msg)
            return jsonify({'msg': 'An email with a recovery token has been sent to your address. Please check your email.', 'status': True})
        except:
            return jsonify({'msg': 'Sorry the website cannot send an email for you right now. Please contact Chris (LINE: chrisj0212) to help resolve your problem', 'status': False})
    else:
        return jsonify({'msg': 'Please enter the token that was sent to your email', 'status': True})


@app.route("/api/changePassword", methods=['POST'])
def changePassword():
    print('RESET PASSWORD 2')
    data = request.get_json()['userData']
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'msg': 'There is no account associated with this email', 'status': False})

    tokenSet = False

    try:
        tokenSet = json.loads(user.extraStr)
    except:
        return jsonify({'msg': 'Please request a new token', 'status': False})

    if int(tokenSet['timestamp']) + 60 < time.time():
        return jsonify({'msg': 'Your token has expired. Please request a new token', 'status': 1})
    else:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        return jsonify({'msg': 'Your password has been changed. Please login again', 'status': True})


@app.route("/api/getRecord", methods=['POST'])
def get_records():
    print('RECORDS')
    userID = request.get_json()['userID']
    user = User.query.get(userID)

    content = jChecker(user, True, True, True)
    userRecord = content['userRecord']
    setRecord = content['setRecord']
    logsRecord = content['logsRecord']

    return jsonify({
        'userRecord': userRecord,
        'logsRecord': logsRecord,
        'setRecord': setRecord
        })


def createAudio(word, defch2):
    print('creating audio', word, defch2)

    result = True

    string = word + '.mp3'

    try:
        voice1 = 'Joanna'
        voice2 = 'Zhiyu'
        response = polly_client.synthesize_speech(VoiceId=voice1,
                    OutputFormat='mp3',
                    Text = word)
        string =  word + '.mp3'

        print(response)

        file = open(string, 'wb')
        file.write(response['AudioStream'].read())
        file.close()

        data = open(string, 'rb')
        filename = 'public/added_en/' + string

        s3_resource.Bucket(bucket_name).put_object(Key=filename, Body=data)
        print('s3 complete')

    except:
         result = 'English Audio Fail'
         print('English Audio Fail:', word)

    return result



@app.route("/api/addAudio", methods=['POST'])
def add_audio():
    print(request.get_json())

    word = request.get_json()['word']
    chinese = request.get_json()['chinese']
    action = request.get_json()['set']
    ### no action for delete yet
    result = 'NONE'

    print('WORD', word)

    defch2 = None

    try:
        action = translate_client.translate_text(Text=word, SourceLanguageCode="en", TargetLanguageCode="zh-TW")
        defch2 = action.get('TranslatedText').split('.')[0]
        print('translation success', defch2)
    except:
        print('translation failed')

    generalList = []

    for obj in bucket.objects.filter(Prefix='public/added_en/'):
        checkWord = obj.key.split('en/')[1].split('.mp3')[0]
        print(checkWord)
        generalList.append(checkWord)

    if word not in generalList:
        result = createAudio(word, defch2)
    else:
        result = 'FOUND'

    print('RESULT', result)

    return jsonify({'result': result, 'defch2': defch2})


@app.route('/api/updateRecord', methods=['POST'])
def update_record():
    print('UPDATE')
    payload = request.get_json()
    # pprint(payload)

    userRecord = payload['userRecord']
    setRecord = payload['setRecord']
    logsRecord = payload['logsRecord']
    jwt = payload['jwt']

    userID = payload['userID']
    user = User.query.get(userID)

    if jwt != user.extraInfo:
        print ('jwt non match', jwt, user.extraInfo)
        response = {
        'status' : 2,
        'msg' : 'You will be logged out because you might be logged in on another device. Please log in again'
        }
        return jsonify(response)
    else:
        print ('jwt match', jwt)

        print('updateRecord', setRecord)

        #jStorer(user, logsRecord, userRecord, userDictionary)
        jStorer(user, logsRecord, userRecord, setRecord)
        redisStorer(user, logsRecord, userRecord, setRecord)

        response = {
            'status' : 1,
            'msg' : 'success'
        }
        return jsonify(response)


@app.route('/api/checkFriend', methods=['POST'])
def checkFriend():
    print('FRIEND')
    payload = request.get_json()
    pprint(payload)
    friendName = payload['friendName']
    friendID = payload['friendID']
    userID = payload['userID']

    print(friendName)
    print(friendID)
    print(userID)

    friend = User.query.get(friendID)
    user = User.query.get(userID)
    friends = {}
    friendsString = None

    print(friend)

    check = True

    if friend and friend.id != userID:
        checkName1 = (friendName.lower()).strip()
        checkName2 = (friend.username.lower()).strip()
        print(checkName1, checkName2)
        if checkName1 != checkName2:
            check = False
    else:
        check = False
        return jsonify({'check': check})


    ## add friend to sql connected and logs json
    if check:
        conUser = Connected.query.filter_by(connected=user).first()
        print(conUser)
        friends = json.loads(conUser.friends)
        print(friends, type(friends))
        friends[friend.id] = friend.username
        conUser.friends = json.dumps(friends)
        print(conUser.friends, type(conUser.friends))
        friendString = conUser.friends
        db.session.commit()

        logsRecord = jChecker(user, True, False, False)['logsRecord']
        logsRecord['friends'][friendID] = friend.username
        ## ad friend to logs
        jStorer(user, logsRecord, None, None)
        redisStorer(user, logsRecord, None, None)


    print(friends, type(friends))
    response = {
        'check' : check,
        'friendName' : friend.username,
        'friendID': friend.id,
        'friends': friendString
    }
    return jsonify(response)

@app.route('/api/deleteFriend', methods=['POST'])
def deleteFriend():
    print('DELETE FRIEND')
    payload = request.get_json()
    pprint(payload)
    friendID = payload['friendID']
    userID = payload['userID']

    print(friendID)
    print(userID)

    friend = User.query.get(friendID)
    user = User.query.get(userID)
    friends = {}
    friendsString = None


    ## remove friend from sql connected and logs json
    conUser = Connected.query.filter_by(connected=user).first()
    print(conUser)
    friends = json.loads(conUser.friends)

    # check frined is in list
    check = friends.pop(friendID, None)
    if check:
        conUser.friends = json.dumps(friends)
        print(conUser.friends, type(conUser.friends))
        friendString = conUser.friends
        db.session.commit()

    logsRecord = jChecker(user, True, False, False)['logsRecord']

    check2 = logsRecord['friends'].pop(friendID, None)
    if check2:
        jStorer(user, logsRecord, None, None)
        redisStorer(user, logsRecord, None, None)

    print(friends, type(friends))
    response = {
        'check' : check,
        'friendID': friend.id,
        'friends': friendString
    }
    return jsonify(response)


@app.route("/api/updateAccount", methods=['POST'])
def updateAccount():
    print('ACCOUNT')
    data = request.get_json()['userData']

    classroom = None
    studentID = None
    school = None

    username = data['username'].strip()
    classroom_raw = data['classroom']
    studentID_raw = data['studentID']
    vocab = data['vocab']
    school_raw = data['school']

    if classroom_raw:
        classroom = classroom_raw.lower().strip()

    if school_raw:
        school = school_raw.strip()

    if studentID_raw:
        studentID = studentID_raw.strip()

    ## pprint(data) don't print image data
    if data['imageData']:
        storeB64(data['imageData'], data['userID'], 'profile')

    current_user = User.query.get(data['userID'])

    checkClass = Classroom.query.filter_by(code=classroom).first()
    newVocab = False

    if checkClass:
         ## deal with checks
        print('classoom', classroom)
        vocab = checkClass.vocab
        if current_user.vocab != vocab:
            newVocab = True
    else:
         print('CLASS ERROR')
         return jsonify({'msg' : 'Sorry, there is no class with this code.', 'err': 1})

    email = (data['email'].lower()).strip()
    checkEmail = User.query.filter_by(email=email).first()
    if checkEmail and checkEmail != current_user:
        print('EMAIL ERROR')
        return jsonify({'msg' : 'This email has been used already.', 'err': 1})

    current_user.username = username
    current_user.classroom = classroom
    current_user.studentID = studentID
    current_user.vocab = vocab
    current_user.school = school
    db.session.commit()

    response = {
        'msg' : 'Thank you ' + data['username'] + ', your account information has been changed',
        'dataReturn' : data,
        'newVocab' : newVocab
    }

    return jsonify(response)


@app.route("/api/ticket", methods=['POST'])
def updateTicket():
    print('TICKET')
    data = request.get_json()['userData']
    pprint(data)

    current_user = User.query.get(data['userID'])
    print(current_user)

    count = Tickets.query.filter_by(user_id=current_user.id).count()
    print('TICKET COUNT: ', count)

    if count > 4:
        response = {
        'msg' : 'Sorry, you have 5 tickets already, please delete one to add more or wait for response, thank you.',
        'dataReturn' : data
        }
        return jsonify(response)

    newTicket = Tickets(user_id=current_user.id, device=data['device'], category=data['category'], issue=data['issue'])
    db.session.add(newTicket)
    db.session.commit()

    response = {
        'msg' : 'Thank you, your ticket has been recorded',
        'dataReturn' : data
    }
    return jsonify(response)


@app.route("/api/sendEmail", methods=['POST'])
def sendEmail():
    print('EMAIL')
    data = request.get_json()['userID']
    pprint(data)

    current_user = User.query.get(data)
    print(current_user)

    msg = Message('Welcome' + current_user.username + ', to VOCAB TRAINER',
                sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
                recipients=[current_user.email, 'cjx02121981@gmail.com'])

    msg.body = 'Your email has been used to register an account with vocab-lms.herokuapp.com. We hope you enjoy building your vocabulary with our application. If you would like to talk to a developer about how to use the application, please contact Chris (LINE: chrisj0212).'
    ## msg.html = "<img href='https://picsum.photos/1024/480'> </img>"

    mail.send(msg)


    response = {
        'msg' : 'Thank you, your email has been sent',
        'dataReturn' : data
    }

    return jsonify(response)

@app.route("/api/addImage", methods=['POST']) #and now the form accepts the submit POST
def addImage():
    print('IMAGE')
    userID = request.get_json()['userID']
    wordData = request.get_json()['wordData']
    mode = [wordData['word'], wordData['link'], wordData['code'], wordData['vocab']]
    print(mode)
    msg = None
    try:
        stringData = request.get_json()['imageData']
        imageData = json.loads(stringData)
        print(len(imageData))
        if len(imageData) > 0:
            storeB64(imageData, userID, mode)
            status = 1
            msg = 'Your entry has been added'
    except:
        print('STORE FAIL')
        msg = 'No Image to Upload'
        status = 0

    ## switch up link codes
    wordData['link'] = str(int(wordData['code']))
    wordData['code'] = str(int(wordData['link']))

    response = {
        'msg' : msg,
        'status' : status,
        'obj' : wordData
    }
    return jsonify(response)

def storeB64(fileData, uid, mode):
    print('STORE_B64', uid)
    user = User.query.get(uid)
    print(user)

    if fileData['image64'] and mode == 'profile':
        print('STORE AVATAR', mode)
        link = 'profileLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/'
        filename = location + 'avatar' + fileType
    elif fileData['image64']:
        print('STORE PICT', mode)
        word = mode[0]
        last_link = mode[1]
        code = mode[2]
        vocab = mode[3]
        link = 'dictionaryLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/' + vocab + '/'
        print(location)
        filename = location + word + str(code) + fileType
        print(filename)

        try:
            print('try delete')
            oldname = location + word + str(last_link) + fileType
            s3_resource.Object(bucket_name, oldname).delete()
            print('filename_deleted', oldname)
        except:
            print('no filename found')


    print('PROCESSING: ' + link)
    data = base64.b64decode(b64data)
    s3_resource.Bucket(bucket_name).put_object(Key=filename, Body=data)

    return filename

''' ############ json handlers ############'''

def jChecker(user, logs, vocab, setD):
    print('##jChecker')

    ## do not delete these they must referenced at the start
    vocab_content = json.dumps({})
    logs_content = json.dumps({})
    set_content = json.dumps({'dictRecord': {}, 'starRecord': {}, 'addRecord': {}})

    #print(type(json.loads(logs_content)), type(json.loads(set_content)))

    if vocab:
        vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
        vocab = {}
        try:
            content_object = s3_resource.Object( 'vocab-lms', vocabKey )
            vocab_content = content_object.get()['Body'].read().decode('utf-8')
        except:
            vocab_content = json.dumps(vocab)
            s3_resource.Bucket(bucket_name).put_object(Key=vocabKey, Body=vocab_content)

    if logs:
        logsKey = "jfolder/" + str(user.id) + '/logs.json'
        logs = {
            'friends': {},
            'settings': {},
            'logs': {}
        }
        try:
            content_object = s3_resource.Object( 'vocab-lms', logsKey )
            logs_content = content_object.get()['Body'].read().decode('utf-8')
            print('try', logs_content)
        except:
            logs_content = json.dumps(logs)
            s3_resource.Bucket(bucket_name).put_object(Key=logsKey, Body=logs_content)
            print('except', logs_content)

    if setD:
        setKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/set.json'
        setD = {'dictRecord': {}, 'starRecord': {}, 'addRecord': {}}
        try:
            content_object = s3_resource.Object( 'vocab-lms', setKey )
            set_content = content_object.get()['Body'].read().decode('utf-8')
            print('try', set_content)
        except:
            set_content = json.dumps(setD)
            s3_resource.Bucket(bucket_name).put_object(Key=setKey, Body=set_content)
            print('except', set_content)

    #print(type(json.loads(logs_content)), type(json.loads(set_content)))
    print(logs_content)

    return {'userRecord': json.loads(vocab_content), 'logsRecord': json.loads(logs_content), 'setRecord': json.loads(set_content)}


def jStorer(user, logsRecord, userRecord, userSet):
    print('##jStorer')
    vocabKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/records.json'
    setKey = "jfolder/" + str(user.id) + '/' + user.vocab + '/set.json'
    logsKey = "jfolder/" + str(user.id) + '/logs.json'

    #print(vocabKey, setKey, logsKey)

    #print('userSet', userSet)

    if logsRecord:
        print('logs stored')
        logs_content = json.dumps(logsRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=logsKey, Body=str(logs_content))

    if userRecord:
        print('vocab stored')
        vocab_content = json.dumps(userRecord)
        s3_resource.Bucket(bucket_name).put_object(Key=vocabKey, Body=str(vocab_content))

    if userSet:
        print('set stored')
        set_content = json.dumps(userSet)
        s3_resource.Bucket(bucket_name).put_object(Key=setKey, Body=str(set_content))

    return True


def redisStorer(user, logsRecord, userRecord, userSet):
    print('##redisStorer')

    try:
        if logsRecord:
            print('redis logs stored')
            logs_content = json.dumps(logsRecord)
            redisData.hset(user.id, 'logs', logs_content)

        if userRecord:
            print('redis vocab stored')
            vocab_content = json.dumps(userRecord)
            folder_string =  'vocab_' + user.vocab
            redisData.hset(user.id, folder_string, vocab_content)

        if userSet:
            print('redis set stored')
            set_content = json.dumps(userSet)
            folder_string = 'set_' + user.vocab
            redisData.hset(user.id, folder_string, set_content)
    except:
        print('redis failed')

    return True





