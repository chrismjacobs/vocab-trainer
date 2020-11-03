
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
    user = User.query.get(userID)
    classroom = user.classroom

    """Check user isn't connected on anoter device"""
    check = Connected.query.filter_by(connected=user).first()
    print('checkUser', check, user)

    if check:
        ## replace old sid with new
        if check.sid != request.sid:
            check.sid = request.sid
            db.session.commit()
    else:
        player = Connected(username=user.username, friends=json.dumps(friends), extraStr=classroom, connected=user, sid=request.sid)
        db.session.add(player)
        db.session.commit()

    ## user is connected
    join_room(user.id)

    """Check if any friends are connected"""
    checkAll = Connected.query.all()

    for c in checkAll:
        if c.extraStr == classroom:
            print('check1', c.connected.id)
            emit('onlineUsers', {'userID': c.connected.id, 'username': c.connected.username}, user.id)
            emit('onlineUsers', {'userID': user.id, 'username': user.username}, c.connected.id)

    '''
    for f in friends:
        ## get friend
        fUser = User.query.get(int(f))
        ## see if they're connected
        cUser = Connected.query.filter_by(connected=fUser).first()
        ## only send emit if user is one of their friends
        if cUser and str(userID) in json.loads(cUser.friends):
            print('online friend emit', int(f), )
            emit('onlineUsers', {'userID': user.id, 'username': user.username}, int(f))
    '''




@socketio.on('challenge')
def on_challenge(data):
    targetID = data['targetID']
    userID = data['userID']
    username = data['username']
    mode = data['mode']

    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    jointroom = str(userID) + '-' + str(targetID)
    join_room(jointroom)

    # send the challenge to the room of opponent
    emit('challengeMatch', {'sender': username, 'mode': mode, 'userID': userID}, int(targetID))
    print('challenge', jointroom, 'target:', targetID, 'sender:', userID, 'mode', mode)

@socketio.on('accept')
def on_accept(data):
    p2 = data['p2']
    p2name = data['p2name']
    p1 = data['p1']
    p1name = data['p1name']
    mode = data['mode']

    print('p1', p1, type(p1))
    print('p2', p2, type(p2))

    jointroom = str(p1) + '-' + str(p2)
    join_room(jointroom)

    emit('start', {'p1': p1, 'p1name': p1name, 'p2': p2, 'p2name': p2name, 'mode': mode}, jointroom)

    print('start', jointroom, str({'p1': p1, 'p1name': p1name, 'p2': p2, 'p2name': p2name, 'mode': mode}))

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
def on_resetEmit():
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    check = Connected.query.filter_by(sid=sid).first()
    print('check', check)

    for r in roomList:
        print('LEAVE ROOM', r)
        emit('reset', {'opponent': 'your opponent'}, r)


@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    check = Connected.query.filter_by(sid=sid).first()
    print('check', check)

    for r in roomList:
        print('LEAVE ROOM', r)
        emit('reset', {'opponent': 'your opponent'}, r)

    if sid not in roomList:
        emit('reset', {'opponent': 'your opponent'}, sid)


    user = check.connected
    username = user.username
    userID = user.id
    classroom = user.classroom

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


