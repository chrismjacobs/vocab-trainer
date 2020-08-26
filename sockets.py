
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
        userDict[user.connected.id] = {'username': user.username, 'userID': user.connected.id}


    userList = json.dumps(userDict)
    return userList



@socketio.on('online')
def online(data):
    """User joins a room"""
    print('user online', data)
    userProfile = data['userProfile']
    user = User.query.get(userProfile['userID'])
    check = Connected.query.filter_by(connected=user).first()

    if check:
        pass
    else:
        player = Connected(username=user.username, connected=user)
        db.session.add(player)
        db.session.commit()

    join_room(user.id)

    newRoom = Room(room=user.id)
    db.session.add(newRoom)
    newRoom.players.append(user)
    db.session.commit()

    emit('onlineUsers', {'userList': getUsers()}, broadcast=True)


@socketio.on('offline')
def on_disconnected(data):
    userProfile = data['userProfile']
    user = User.query.get(userProfile['userID'])
    check = Connected.query.filter_by(connected=user).first()

    if check:
        Connected.query.filter_by(connected=user).delete()
        db.session.commit()

    leave_room(user.id)
    emit('onlineUsers', {'userList' : getUsers()}, broadcast=True)

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
    target = data['target']
    userID = data['userID']
    username = data['username']
    mode = data['mode']

    emit('challenge', {'sender': username, 'mode': mode, 'userID': userID}, target )

    print('challenge', 'target:', target, 'sender:', userID, 'mode', mode)

@socketio.on('accept')
def on_accept(data):
    p2 = data['p2']
    p2name = data['p2name']
    p1 = data['p1']
    p1name = data['p1name']
    mode = data['mode']

    leave_room(p2)
    join_room(p1)

    newRoom = Room(room=p1)
    db.session.add(newRoom)
    newRoom.players.append(User.query.get(p2))
    db.session.commit()
    print(newRoom.players)

    emit('start', {'p1': p1, 'p1name': p1name, 'p2': p2, 'p2name': p2name, 'mode': mode}, p1)

    print('accept', 'p1', p1, 'p2', p2, 'mode', mode)

@socketio.on('ready')
def on_ready(data):
    room = data['room']
    player = data['player']
    testItems = data['testItems']

    emit('go', {'player': player, 'testItems': testItems}, room)

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

    print('wrong', 'room', room, 'player', player)



@socketio.on('disconnect')
def on_disconnect():
    print('Client Disconnected')

@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": 'Chris'})


