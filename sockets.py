
from app import app, db, socketio, cors
import json
from pprint import pprint
from models import *
from flask import request
from flask_socketio import SocketIO, join_room, leave_room, send, emit, rooms
from flask_cors import CORS

print('SOCKETS')


def getUsers ():
    userSearch = Connected.query.all()
    userDict = {}

    for user in userSearch:
        userDict[user.connected.id] = {'username': user.connected.username, 'userID': user.connected.id}


    userList = json.dumps(userDict)
    return userList


@socketio.on('online')
def online(data):
    """User joins a room"""
    print('user online', data)
    userProfile = data['userProfile']
    friends = data['friends']
    userID = userProfile['userID']
    user = User.query.get(userID)
    check = Connected.query.filter_by(connected=user).first()
    print('checkUser', check, user, friends)

    if check:
        if check.extraStr != request.sid:
            check.extraStr = request.sid
            db.session.commit()
    else:
        player = Connected(username=user.username, friends=json.dumps(friends), connected=user, extraStr=request.sid)
        db.session.add(player)
        db.session.commit()

    join_room(user.id)

    checkAll = Connected.query.all()

    for c in checkAll:
        print('check1', c.connected.id, friends)
        if str(c.connected.id) in friends:
            emit('onlineUsers', {'userID': c.connected.id, 'username': c.connected.username}, user.id)


    for f in friends:
        fUser = User.query.get(int(f))
        cUser = Connected.query.filter_by(connected=fUser).first()
        if cUser and f in json.loads(cUser.friends):
            print('online friend emit', int(f))
            emit('onlineUsers', {'userID': user.id, 'username': user.username}, int(f))


@socketio.on('offline')
def on_offline(data):
    print(data)
    userID = data['userID']
    user = User.query.get(userID)

    print('user', user)
    check = Connected.query.filter_by(connected=user).first()
    print('check', check)

    friends = {}

    if check:
        friends = json.loads(check.friends)
        Connected.query.filter_by(connected=user).delete()
        db.session.commit()


    for f in friends:
        print('friend', int(f))
        emit('offlineUsers', {'userID' : user.id}, int(f))

    emit('disconnect', {'userID': user.id}, user.id)

    print(user.username, 'offline')

@socketio.on('sayHi')
def on_sayHi(data):
    target = data['target']
    userID = data['userID']
    username = data['username']

    #user = User.query.get(userID)

    emit('sayHi', {'sender' : username}, target )

    print('sayHI', 'target:', target, 'sender:', userID)

@socketio.on('challenge')
def on_challenge(data):
    targetID = data['targetID']
    userID = data['userID']
    username = data['username']
    mode = data['mode']

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

    #newRoom = Room(room=p1)
    #db.session.add(newRoom)
    #newRoom.players.append(User.query.get(p2))
    #db.session.commit()
    #print(newRoom.players)

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
    chinese = data['chinese']
    btnID = data['btnID']
    player = data['player']
    state = data['state']

    emit('answer', {'player': player, 'name': name, 'chinese': chinese, 'btnID': btnID, 'state': state}, room)

    print('answer:', 'room', room, 'player', player)

@socketio.on('settingsData')
def on_settings(data):
    room = data['room']
    settingsData =  data['settingsData']


    emit('newSettings', {'settingsData': settingsData}, room)

    print('newSettings:', 'room', room, 'settings', settingsData)



@socketio.on('disconnect')
def on_disconnect():
    sid = request.sid
    print(sid)
    roomList = rooms(sid=sid)
    print(roomList)

    check = Connected.query.filter_by(extraStr=sid).first()
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
            emit('offlineUsers', {'userID': userID}, int(f))


        Connected.query.filter_by(extraStr=sid).delete()
        db.session.commit()

    print('Client Disconnected')

@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": 'Chris'})


