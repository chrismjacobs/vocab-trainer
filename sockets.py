
from app import app, db, socketio, cors
import json
from pprint import pprint
from models import *
from flask import request
from flask_socketio import SocketIO, join_room, leave_room, send, emit, rooms
from flask_cors import CORS

print('SOCKETS')


@socketio.on('online')
def online(data):

    """User joins personal room"""
    print('user online')
    userProfile = data['userProfile']
    friends = data['friends']
    userID = userProfile['userID']
    user = Users.query.get(userID)
    classroom = user.classroom

    """Check user isn't connected on anoter device"""
    check = Connected.query.filter_by(connected=user).first()
    print('checkUser', check, user)

    classmates = [ {'id': 100000, 'name': 'AI Bot', 'status': 1}]

    checkUsers = Connected.query.all()
    checkClass = []

    if classroom:
        users = Users.query.filter_by(classroom=classroom).all()
        for cu in checkUsers:
            checkClass.append(cu.connected)

        for u in users:
            if u is not user:
                if u in checkClass:
                    status = 1
                else:
                    status = 0
                classmates.append({ 'id': u.id, 'name': u.username, 'status': status })

    if check:
        ## replace old sid with new
        if check.sid != request.sid:
            check.sid = request.sid
            db.session.commit()
    else:
        player = Connected(username=user.username, friends=json.dumps(classmates), extraStr=classroom, connected=user, sid=request.sid)
        db.session.add(player)
        db.session.commit()

    ## user is connected
    join_room(user.id)

    emit('onlineUsers', {'friends': classmates}, user.id)

    """Check if any friends are connected"""
    checkAll = Connected.query.all()
    for c in checkAll:
        if c.extraStr == classroom and c.connected is not user:
            print('check1', c.connected.id)
            emit('onlineUsers', {'userID': user.id}, c.connected.id)



@socketio.on('challenge')
def on_challenge(data):
    targetID = data['targetID']
    userID = data['userID']
    username = data['username']
    mode = data['mode']
    action = data['action']

    print('challenge', action)

    sid = request.sid
    roomList = rooms(sid=sid)
    print(roomList)

    user = Users.query.get(userID)

    jointroom = None

    if action == 'send':
        jointroom = str(userID) + '-' + str(targetID)
        join_room(jointroom)
        roomList = rooms(sid=sid)
        print('send', roomList )
        emit('challengeMatch', {'sender': username, 'mode': mode, 'userID': userID, 'action': action}, targetID)

    elif action == 'retract':
        jointroom = str(userID) + '-' + str(targetID)
        leave_room(jointroom)
        roomList = rooms(sid=sid)
        print('retract', roomList )
        emit('challengeMatch', {'sender': username, 'mode': mode, 'userID': userID, 'action': action}, targetID)

    elif action == 'accept':
        jointroom = str(targetID) + '-' + str(userID)
        join_room(jointroom)
        emit('start', {'p1': targetID, 'p2': userID, 'p2name': username, 'mode': mode}, jointroom)
        print('emitstart')
        return True

    print('continue')

    # send the challenge to the room of opponent


    """Check if any friends are connected"""
    checkAll = Connected.query.filter_by(extraStr=user.classroom).all()

    for c in checkAll:
        if c.connected.id != targetID and c.connected.id != userID:
            emit('busy', {'userID': userID, 'targetID': targetID, 'action': action}, c.connected.id)

    print('challenge', jointroom, 'target:', targetID, 'sender:', userID, 'mode', mode, 'action', action)

@socketio.on('ready')
def on_ready(data):
    room = data['room']
    player = data['player']
    testItems = data['testItems']
    timeReset = data['timeReset']

    emit('go', {'player': player, 'testItems': testItems, 'timeReset': timeReset}, room)

    print('go', room, str({'player': player, 'timeReset': timeReset}) )

@socketio.on('answer')
def on_answer(data):
    room = data['room']
    name = data['name']
    answer = data['answer']
    btnID = data['btnID']
    player = data['player']
    state = data['state']

    emit('answerMatch', {'player': player, 'name': name, 'answer': answer, 'btnID': btnID, 'state': state}, room)

    print('answerMatch:', 'room', room, 'player', player)

@socketio.on('answerMem')
def on_answer(data):
    print(data)
    room = data['room']
    card = data['card']
    match = data['match']
    player = data['player']
    answer = data['answer']
    count = data['count']

    emit('answerCard', {'player': player, 'card': card, 'match': match, 'answer': answer, 'count': count}, room)

    print('answerCard', 'room', room, 'player', player)

@socketio.on('updateType')
def updateType(data):
    print(data)
    room = data['room']
    opponent = data['opponent']
    current = data['current']
    player = data['player']
    state = data['state']

    emit('updateSignal', {'player': player, 'state': state, 'current': current, 'opponent': opponent}, room)

    print('updateSignal:', 'room', room, 'player', player, 'state', state)


@socketio.on('answerSend')
def answerSend(data):
    print(data)
    room = data['room']
    opponent = data['opponent']
    player = data['player']
    answer = data['answer']
    state = data['state']

    emit('answerComplete', {'player': player, 'state': state, 'answer': answer, 'opponent': opponent}, room)

    print('answerComplete:', 'room', room, 'player', player, 'state', state)


@socketio.on('settingsData')
def on_settings(data):
    room = data['room']
    settingsData =  data['settingsData']

    emit('newSettings', {'settingsData': settingsData}, room)

    print('newSettings:', 'room', room, 'settings', settingsData)

@socketio.on('resetEmit')
def on_resetEmit(data):
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)
    player = data['player']

    # check = Connected.query.filter_by(sid=sid).first()
    # print('check', check)

    for r in roomList:
        print('LEAVE ROOM', r)
        emit('leaveRoom', {'opponent': player}, r)


@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    check = Connected.query.filter_by(sid=sid).first()
    print('check', check)

    user = check.connected
    username = user.username
    userID = user.id
    classroom = user.classroom


    for r in roomList:
        print('LEAVE ROOM DISCONNECT', r)
        emit('reset', {'opponent': username }, r)

    # if sid not in roomList:
    #     emit('reset', {'opponent': 'your opponent'}, sid)

    checkAll = Connected.query.all()

    for c in checkAll:
        if c.extraStr == classroom:
            print('disconnect with ', c.connected.id)
            emit('offlineUsers', {'userID': userID}, c.connected.id)


    Connected.query.filter_by(sid=sid).delete()
    db.session.commit()

    print('Client Disconnected')

@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": 'Chris'})


