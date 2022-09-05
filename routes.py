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
    checkEmail = Users.query.filter_by(email=email).first()
    if checkEmail:
        print('EMAIL ERROR')
        return jsonify({'msg' : 'This email has been used already.', 'err': 1})

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    newUser = Users(username=name, email=email, password=hashed_password)
    db.session.add(newUser)
    db.session.commit()

    user = Users.query.filter_by(username=name).first()

    response = {
        'msg' : 'Hi ' + data['username'] + ', you have been registered. Please log in to continue'
    }

    try:
        send_welcome_email(user)
    except:
        print('email failed')

    return jsonify(response)

def redisDataGetter(user):
    rData = redisData.hgetall(user.id)
    print('redis', rData.keys())

    userRecord = {}
    logsRecord = {'friends': {}, 'settings': {}, 'logs': {}}
    setRecord = {'dictRecord': {}, 'starRecord': {}, 'addRecord': {}}

    try:
        userRecord = json.loads(rData['vocab_' + user.vocab])
    except:
        print('no userRecord found')

    try:
        setRecord = json.loads(rData['set_' + user.vocab])
    except:
        print('no setRecord found')

    try:
        logsRecord = json.loads(rData['logs'])
    except:
        print('no logsRecord found')

    return [userRecord, logsRecord, setRecord]



@app.route("/api/login", methods=['POST'])
def login():
    print('LOGIN')
    data = request.get_json()
    pprint(data)
    skeleton = False
    user = Users.query.filter_by(email=data['userData']['email']).first()

    try:
        tokenSet = json.loads(user.extraStr)
        #if int(tokenSet['timestamp']) + 60 < time.time():
            #return jsonify({'msg': 'Your token has expired. Please request a new token', 'status': 1})
        if tokenSet['secret'] == data['userData']['password']:
            msg = 'Please Reset Password'
            return jsonify({ 'msg': msg, 'err': 2 })
    except:
        pass


    if data['userData']['password'] == 'skeleton':
        skeleton = True
    else:
        user = authenticate(**data)

    if not user:
        print('INVALID')
        return jsonify({ 'msg': 'Invalid credentials - please check username and password', 'err': 1 })

    ## content = redisChecker(user, True, True, True)
    rArray = redisDataGetter(user)
    # print(rArray)

    classmates = {}

    if user.classroom: # no action if classroom is not set
        users = Users.query.filter_by(classroom = user.classroom).all()
        print('CLASSROOM', user.classroom)
        for u in users:
            print('maker')
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

    if not skeleton:
        user.extraInfo = token_string
        db.session.commit()

    redisEmails = json.loads(redisData.hgetall('emails')['list'])

    msg = ''

    if user.classroom == None:
        msg = 'Welcome ' + user.username + ', please join a classroom to unlock more features.'
    elif user.email in redisEmails:
        msg = 'Welcome ' + user.username + ', your email: ' + user.email + ' may not be valid, please update.'
    else:
        msg = 'Welcome ' + user.username + ', you have been logged in with classroom: ' + user.classroom

    print(msg)

    return jsonify({
        'token': token_string,
        'msg': msg,
        'userProfile': userProfile,
        'userRecord': rArray[0],
        'logsRecord': rArray[1],
        'setRecord': rArray[2],
        'skeleton': skeleton
        })

@app.route("/api/getRecord", methods=['POST'])
def get_records():
    print('RECORDS')
    userID = request.get_json()['userID']
    user = Users.query.get(userID)

    rArray = redisDataGetter(user)

    return jsonify({
        'userRecord': rArray[0],
        'logsRecord': rArray[1],
        'setRecord': rArray[2]
        })


@app.route("/api/getGroups", methods=['POST'])
def getGroups():
    print('INSTRUCTOR GROUPS')
    data = request.get_json()
    pprint(data)

    userID = data['userID']

    # classroomList = Classroom.query.filter_by(user_id=userID).all()
    returnData = redisData.hgetall('classcodes')


    codeList = ['fhvs701', 'jwsh10']

    groups = []
    for c in returnData:
        loadC = json.loads(returnData[c])
        print(loadC)
        intID = loadC['instID']
        try:
            intID = int(loadC['instID'])
        except:
            pass
        if intID == userID:
            groups.append({'code': c, 'count': Users.query.filter_by(classroom=c).count()})
        elif userID == 1 and c in codeList:
            groups.append({'code': c, 'count': Users.query.filter_by(classroom=c).count()})

    return jsonify({
        'classGroups' : groups
        })


def classCodesGet():
    dataReturn = redisData.hgetall('classcodes')
    #pprint(dataReturn)

    if not dataReturn:
        print('NO DATA RETURN')
        return {}

    newDict = {}
    for cc in dataReturn:
        newDict[cc] = json.loads(dataReturn[cc])

    return newDict

@app.route("/api/classCodes", methods=['POST'])
def classCodes():
    print('CLASS CODES')
    data = request.get_json()
    pprint(data)

    if data['action'] == 'get':
        return jsonify({
            'classCodes' : classCodesGet()
        })
    elif data['action'] == 'set':
        print('SET', data['codeData']['code'], type(json.dumps(data['codeData'])))
        redisData.hset('classcodes', data['codeData']['code'], json.dumps(data['codeData']))
        return jsonify({
            'classCodes' : classCodesGet()
        })
    elif data['action'] == 'delete':
        print('DELETE')
        redisData.hdel('classcodes', data['codeData']['code'])
        return jsonify({
            'classCodes' : classCodesGet()
        })


@app.route("/api/instructorRedis", methods=['POST'])
def instructorRedis():
    print('INSTRUCTOR REDIS')

    data = request.get_json()
    pprint(data)

    group = data['group']
    action = data['action']

    msg = None
    payload = {}


    if action == 'setNotes':
        notes = data['notes']
        # print(notes)
        redisData.hset(group, "notes", json.dumps(notes))

    elif action == 'setPictQuiz':
        notes = data['notes']
        # print(notes)
        redisData.hset(group, "pictquiz", json.dumps(notes))

    elif action == 'setTests':
        testData = data['testData']
        redisData.hset(group, "tests", json.dumps(testData))
        active = redisData.hget(group, "active")
        payload['testData'] = testData
        payload['activeQuiz'] = json.loads(active)
        msg = 'setTests'

    elif action == 'setActive':
        activeQuiz = data['activeQuiz']
        redisData.hset(group, "active", json.dumps(activeQuiz))
        payload = activeQuiz
        msg = None

    elif action == 'setStudent':
        studentTests = data['studentTests']
        student = data['student']
        redisData.hset(group, student, json.dumps(studentTests))
        payload = studentTests
        msg = 'setStudent'

    elif action == 'setUpdate':
        student = str(data['student'])
        word = data['word']
        string = redisData.hget(group, "updates")
        if string == None:
            print('NEW UPDATES NOTES SET')
            redisData.hset(group, "updates", json.dumps({}))
            updatesData = {}
        else:
            updatesData = json.loads(string)

        print(updatesData)

        if student not in updatesData:
            updatesData[student] = {word:1}
        else:
            updatesData[student][word] = 1

        redisData.hset(group, "updates", json.dumps(updatesData))
        payload = updatesData

    #############################33

    elif action == 'getNotesInstructor':
        string = redisData.hget(group, "notes")
        if string:
            payload = json.loads(string)
        msg = 'setNotes'

    elif action == 'getUpdatesInstructor':
        string = redisData.hget(group, "updates")
        if string:
            payload = json.loads(string)
        else:
            payload = {}
        msg = 'setUpdates'

    elif action == 'getNotesStudent':
        student = (data['student'])
        rDict = json.loads(redisData.hget(group, "notes"))
        if rDict[str(student)]:
            payload = rDict[str(student)]
        msg = 'setNotes'

    elif action == 'getStudent':
        student = (data['student'])
        jString = redisData.hget(group, student)
        if jString:
            sDict = json.loads(redisData.hget(group, student))
            payload = sDict
        msg = 'setStudent'

    elif action == 'getPictQuiz':
        jString = redisData.hget(group, 'pictList')
        if jString:
            sDict = json.loads(redisData.hget(group, student))
            payload = sDict
        msg = 'setPictList'

    elif action == 'getTests':
        string = redisData.hget(group, "tests")
        active = redisData.hget(group, "active")
        if string:
            payload['testRecords'] = json.loads(string)
            try:
                payload['activeQuiz'] = json.loads(active)
            except:
                payload['activeQuiz'] = {}
        else:
            payload['testRecords'] = {}
            payload['activeQuiz'] = {}

        msg = 'setTests'

    elif action == 'getResults':
        classList = Users.query.filter_by(classroom=group).all()
        allData = redisData.hgetall(group)
        # not sure what this is for
        if allData and allData['notes']:
            del allData['notes']
        payload = allData
        msg = 'setResults'

    else:
        msg = 'fail'

    print(action, msg, payload)

    return jsonify({
        'payload' : payload,
        'msg' : msg,
        })


@app.route("/api/getClass", methods=['POST'])
def get_class():
    print('GET CLASS')

    userID = request.get_json()['userID']
    user = Users.query.get(userID)
    classroom = request.get_json()['classroom']

    users = Users.query.filter_by(classroom=classroom).all()

    classDict = {}

    for user in users:
        classDict[user.id] = {}
        classDict[user.id]['user'] = user.username
        classDict[user.id]['studentID'] = user.studentID
        classDict[user.id]['userID'] = user.id
        classDict[user.id]['email'] = user.email
        classDict[user.id]['date'] = user.extraStr

        content = redisChecker(user, False, True, True)
        classDict[user.id]['userRecord'] = content['userRecord']
        classDict[user.id]['setRecord'] = content['setRecord']

    return jsonify({
        'classroom': classroom,
        'classRecords': classDict
        })


def send_welcome_email(user):
    print(user)
    try:
        msg = Message('Welcome ' + user.username + ', to VOCAB TRAINER',
                    sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
                    recipients=[user.email, 'cjx02121981@gmail.com'])

        msg.body = 'Your email has been used to register an account with vocab-lms.herokuapp.com. We hope you enjoy building your vocabulary with our application. If you would like to talk to a developer about how to use the application, please contact Chris (LINE: chrisj0212).'
        ## msg.html = "<img href='https://picsum.photos/1024/480'> </img>"

        mail.send(msg)
    except:
        print('welcome email ERROR')

    return True

def send_ticket_email(data, user):
    try:
        msg = Message('VOCAB TRAINER - Your ticket has been sent',
                    sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
                    recipients=[user.email, 'cjx02121981@gmail.com'])
        msg.body = 'Your ticket has been sent to VCOAB TRAINER and will be reviewed and a reply sent to this email in 48 hours. If the issue is urgent please contact Chris (LINE: chrisj0212). Your ticket info: ' + data

        mail.send(msg)
    except:
        print('ticket email ERROR')

    return True


@app.route("/api/requestToken", methods=['POST'])
def requestToken():
    print('RESET PASSWORD')
    email = request.get_json()['email']
    user = Users.query.filter_by(email=email).first()

    if not user:
        return jsonify({'msg': 'There is no account associated with this email', 'status': False})

    secret = secrets.token_hex(16)
    timestamp = time.time()
    print(timestamp) # 1610367054.5547

    tokenSet = json.dumps({'secret':secret, 'timestamp': timestamp})
    user.extraStr = tokenSet
    db.session.commit()
    try:
        msg = Message('VOCAB TRAINER - Password Reset',
        sender=('VOCAB TRAINER','vocab1trainer@gmail.com'),
        recipients=[user.email, 'cjx02121981@gmail.com'])
        msg.body = 'Dear ' + user.username + ', a password reset for your VOCAB TRAINER account has been requested. You may use the following TEMPORARY PASSWORD to login: ' + secret
        mail.send(msg)
        return jsonify({'msg': 'An email with a temporary password has been sent to your address. Please check your email.', 'status': True})
    except:
        return jsonify({'msg': 'Sorry the website cannot send an email for you right now. Please contact Chris (LINE: chrisj0212) to help resolve your problem', 'status': False})


@app.route("/api/changePassword", methods=['POST'])
def changePassword():
    print('RESET PASSWORD 2')
    data = request.get_json()['userData']
    user = Users.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'msg': 'There is no account associated with this email', 'status': False})

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user.password = hashed_password
    db.session.commit()
    return jsonify({'msg': 'Your password has been changed. Please login to continue', 'status': True})


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


@app.route("/api/copyImage", methods=['POST'])
def copy_image():
    print(request.get_json())

    word = request.get_json()['word']
    link = request.get_json()['link']
    user = request.get_json()['user']

    new_filepath = 'user/test/word.jpeg'

    # Copy object A as object B
    s3_resource.Object(bucket_name, new_filepath).copy_from(
    CopySource=link)

    return jsonify({'new_filepath': new_filepath})


@app.route('/api/updateRecord', methods=['POST'])
def updateRecord():
    print('UPDATE')
    payload = request.get_json()
    # pprint(payload)

    userRecord = payload['userRecord']
    setRecord = payload['setRecord']
    logsRecord = payload['logsRecord']
    jwt = payload['jwt']

    userID = payload['userID']
    user = Users.query.get(userID)

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
        #jStorer(user, logsRecord, userRecord, setRecord)
        redisStorer(user, logsRecord, userRecord, setRecord)

        response = {
            'status' : 1,
            'msg' : 'success'
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
        try:
            if " " in classroom:
                classroom = classroom.replace(" ", "")
        except:
            print('REPLACE FAIL')

    if school_raw:
        school = school_raw.strip()

    if studentID_raw:
        studentID = studentID_raw.strip()

    ## pprint(data) don't print image data
    if data['imageData']:
        storeB64(data['imageData'], data['userID'], 'profile')

    current_user = Users.query.get(data['userID'])

    #checkClass = Classroom.query.filter_by(code=classroom).first()
    returnData = redisData.hgetall('classcodes')
    newVocab = False
    print(returnData)

    if returnData[classroom]:
         ## deal with checks
        print('classoom', classroom)
        jsonData = json.loads(returnData[classroom])
        vocab = jsonData['vocab']
        if current_user.vocab != vocab:
            newVocab = True
    else:
         print('CLASS ERROR')
         return jsonify({'msg' : 'Sorry, there is no class with this code.', 'err': 1})

    email = (data['email'].lower()).strip()
    checkEmail = Users.query.filter_by(email=email).first()
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

    current_user = Users.query.get(data['userID'])
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

    send_ticket_email(str(data), current_user)

    response = {
        'msg' : 'Thank you, your ticket has been recorded',
        'dataReturn' : data
    }
    return jsonify(response)


@app.route("/api/addImage", methods=['POST']) #and now the form accepts the submit POST
def addImage():
    print('IMAGE')
    userID = request.get_json()['userID']
    wordData = request.get_json()['wordData']
    modeDict = {
        'word': wordData['word'],
        'oldLink': wordData['link'],
        'newLink': wordData['code'],
        'vocab': wordData['vocab']
    }

    #print(modeDict)
    print('wordData1', wordData)
    msg = None
    try:
        wordData['link'] = str(int(wordData['code']))
        stringData = request.get_json()['imageData']
        imageData = json.loads(stringData)
        print('imageDataLength', len(imageData))
        if len(imageData) > 0:
            storeB64(imageData, userID, modeDict)
            status = 1
            msg = 'Your entry has been added'
            ## switch up link codes: new Link equal code

    except:
        print('STORE ABORT: No Image')
        msg = 'No Image to Upload'
        status = 0

    print('wordData2', wordData)

    response = {
        'msg' : msg,
        'status' : status,
        'obj' : wordData
    }
    return jsonify(response)


def storeB64(fileData, uid, modeDict):
    print('STORE_B64', uid)
    user = Users.query.get(uid)

    if fileData['image64'] and modeDict == 'profile':
        print('STORE AVATAR', modeDict)
        link = 'profileLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/'
        filename = location + 'avatar' + fileType
    elif fileData['image64']:
        print('STORE PICT', modeDict)
        word = modeDict['word']
        oldLink = modeDict['oldLink']
        newLink = modeDict['newLink']
        vocab = modeDict['vocab']
        link = 'dictionaryLink'
        b64data = fileData['image64']
        fileType = '.jpg'
        location = 'public/profiles/' + str(uid) + '/' + vocab + '/'
        print(location)
        filename = location + word + str(newLink) + fileType
        print(filename)

        '''
        ## delete old file because might be used in picture quiz
        try:
            print('try delete')
            oldname = location + word + str(oldLink) + fileType
            s3_resource.Object(bucket_name, oldname).delete()
            print('filename_deleted', oldname)
        except:
            print('no filename found')
        '''

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
        print(setKey)
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

def redisChecker(user, logs, vocab, setD):
    print('##jRedisChecker')

    ## do not delete these they must referenced at the start
    vocab_content = json.dumps({})
    logs_content = json.dumps({})
    set_content = json.dumps({'dictRecord': {}, 'starRecord': {}, 'addRecord': {}})

    #print(type(json.loads(logs_content)), type(json.loads(set_content)))

    if vocab and redisData.hget(user.id, 'vocab_' + user.vocab):
        vocabGet = redisData.hget(user.id, 'vocab_' + user.vocab)
    else:
        vocabGet = vocab_content

    if setD and redisData.hget(user.id, 'set_' + user.vocab):
        setGet = redisData.hget(user.id, 'set_' + user.vocab)
    else:
        setGet = set_content

    if logs and redisData.hget(user.id, 'logs'):
        logsGet = redisData.hget(user.id, 'logs')
    else:
        logsGet = logs_content

    return {'userRecord': json.loads(vocabGet), 'logsRecord': json.loads(logsGet), 'setRecord': json.loads(setGet)}


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





