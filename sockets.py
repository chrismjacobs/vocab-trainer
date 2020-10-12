
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
    print('user online', data)
    userProfile = data['userProfile']
    friends = data['friends']
    userID = userProfile['userID']
    user = User.query.get(userID)

    """Check user isn't connected on anoter device"""
    check = Connected.query.filter_by(connected=user).first()
    print('checkUser', check, user, friends)

    if check:
        ## replace old sid with new
        if check.sid != request.sid:
            check.sid = request.sid
            db.session.commit()
    else:
        player = Connected(username=user.username, friends=json.dumps(friends), connected=user, sid=request.sid)
        db.session.add(player)
        db.session.commit()

    ## user is connected
    join_room(user.id)

    """Check if any friends are connected"""
    checkAll = Connected.query.all()

    for c in checkAll:
        print('check1', c.connected.id, c.friends)
        if str(c.connected.id) in friends:
            ## online data to the user about who is logged in currently
            emit('onlineUsers', {'userID': c.connected.id, 'username': c.connected.username}, user.id)


    for f in friends:
        ## get friend
        fUser = User.query.get(int(f))
        ## see if they're connected
        cUser = Connected.query.filter_by(connected=fUser).first()
        ## only send emit if user is one of their friends
        if cUser and str(userID) in json.loads(cUser.friends):
            print('online friend emit', int(f), )
            emit('onlineUsers', {'userID': user.id, 'username': user.username}, int(f))


def on_offline(user, check):

    friends = {}

    friends = json.loads(check.friends)
    Connected.query.filter_by(connected=user).delete()
    db.session.commit()


    for f in friends:
        print('friend', int(f))
        emit('offlineUsers', {'userID' : user.id}, int(f))

    emit('disconnect', {'userID': user.id}, user.id)

    print(user.username, 'offline')

@socketio.on('challenge')
def on_challenge(data):
    targetID = data['targetID']
    userID = data['userID']
    username = data['username']
    mode = data['mode']

    # send the challenge to the room of opponent
    emit('challenge', {'sender': username, 'mode': mode, 'userID': userID}, int(targetID))
    print('challenge', 'target:', targetID, 'sender:', userID, 'mode', mode)

@socketio.on('accept')
def on_accept(data):
    p2 = data['p2']
    p2name = data['p2name']
    p1 = data['p1']
    p1name = data['p1name']
    mode = data['mode']

    leave_room(p2)
    join_room(p1)

    emit('start', {'p1': p1, 'p1name': p1name, 'p2': p2, 'p2name': p2name, 'mode': mode}, p1)

    print('accept', 'p1', p1, 'p2', p2, 'mode', mode)

@socketio.on('ready')
def on_ready(data):
    room = data['room']
    player = data['player']
    testItems = data['testItems']
    timeReset = data['timeReset']

    emit('go', {'player': player, 'testItems': testItems, 'timeReset': timeReset}, room)

    print('ready', 'room', room, 'player', player, 'testItems', testItems )

@socketio.on('answer')
def on_answer(data):
    room = data['room']
    name = data['name']
    answer = data['answer']
    btnID = data['btnID']
    player = data['player']
    state = data['state']

    emit('answer', {'player': player, 'name': name, 'answer': answer, 'btnID': btnID, 'state': state}, room)

    print('answer:', 'room', room, 'player', player)

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
    state = data['state']

    emit('answerComplete', {'player': player, 'state': state, 'opponent': opponent}, room)

    print('complete:', 'room', room, 'player', player, 'state', state)


@socketio.on('settingsData')
def on_settings(data):
    room = data['room']
    settingsData =  data['settingsData']


    emit('newSettings', {'settingsData': settingsData}, room)

    print('newSettings:', 'room', room, 'settings', settingsData)


@socketio.on('leftMatch')
def on_leftMatch(data):

    p2 = data['p2']
    p1 = data['p1']
    userID = data['userID']

    p2name = User.query.get(p2).username
    p1name = User.query.get(p1).username

    p1con = Connected.query.filter_by(user_id=p1).first()
    p2con = Connected.query.filter_by(user_id=p2).first()

    if userID is not p1:
        leave_room(p1)
        join_room(p2)

    if p1con:
        p1sid = p1con.sid
        emit('kickOff', {'opponent': p2name}, p1sid)

    if p2con:
        p2sid = p2con.sid
        emit('kickOff', {'opponent': p1name}, p2sid)

@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    check = Connected.query.filter_by(sid=sid).first()
    print('check', check)

    if check:
        friendList = json.loads(check.friends)
        user = check.connected
        username = user.username
        userID = user.id
        for r in roomList:
            leave_room(r)
            print('LEAVE ROOM', r)
            emit('leftRoom', {'sender': username, 'userID': userID}, r)

        for f in friendList:
            print('Offline Signal: ', int(f))
            fOnline = Connected.query.filter_by(user_id=int(f)).first()
            if fOnline:
                emit('offlineUsers', {'userID': userID}, fOnline.sid)

        ## leave room before reconnecting??

        Connected.query.filter_by(sid=sid).delete()
        db.session.commit()

    print('Client Disconnected')

@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": 'Chris'})


