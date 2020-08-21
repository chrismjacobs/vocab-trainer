
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
    """User joins a room"""
    print('user online', data)

    user = User.query.get(data['id'])

    check = Connected.query.filter_by(username=data['username'], studentID=data['studentID']).first()

    if check:
        pass
    else:
        player = Connected(user.username, player_id=user)
        db.session.add(user)
        db.session.commit()

    userSearch = Connected.query.all()
    userDict = {}

    for user in userSearch:
        userDict[user.username] = user.studentID

    userList = json.dumps(userDict)
    print(type(userList), userList)

    emit('onlineUsers', {'userList' : userList})


@socketio.on('offline')
def on_disconnected(data):
    check = Connected.query.filter_by(username=data['username'], studentID=data['studentID']).first()

    if check:
        Connected.query.filter_by(username=data['username'], studentID=data['studentID']).delete()
        db.session.commit()

    leave_room(data['room'])

    print(data['username'], 'offline')



@socketio.on('disconnect')
def on_disconnect():

    print('Client Disconnected')

@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": 'Chris'})

@socketio.on('start_room')
def on_start(data):
    """User starts a room"""
    print(data)
    room = data['username'][:2].lower() + data['studentID'][:2] + request.sid[:2]
    print('room started', room)

    user = Connected.query.filter_by(username=data['username'], studentID=data['studentID']).first()
    clients = Connected.query.filter_by(room=room).count()

    error = 5
    msg = "..."

    if clients == 0:
        user.room = room
        db.session.commit()
        msg = 'Room Ready'
        join_room(room)
        error = 0
    elif user.room == room:
        msg = 'Room already started'
        error = 1
    elif clients > 0:
        msg = 'This room cannot be started'
        error = 2

    print(msg)
    socket_id = request.sid
    print(rooms(socket_id))

    emit('roomReady', {'msg': msg,  'error': error, 'clients': clients, 'room': room}, room )


@socketio.on('join_room')
def on_join(data):
    """User joins a room"""

    room = data['room']
    print('room joined', room)

    user = Connected.query.filter_by(username=data['username'], studentID=data['studentID']).first()
    clients = Connected.query.filter_by(room=room).count()

    error = 5
    msg = "..."

    if clients == 1:
        user.room = room
        db.session.commit()
        msg = 'Room Ready'
        error = 0
        join_room(data['room'])
    elif user.room == room:
        msg = 'Room already joined'
        error = 1
    elif clients == 0:
        msg = 'This room does not exist'
        error = 2
    elif clients == 2:
        msg = 'This room does not exist'
        error = 3

    print(msg)
    socket_id = request.sid
    print(rooms(socket_id))

    emit('playerReady', {'msg': msg, 'error': error, 'clients': clients, 'room': room}, room)

@socketio.on('buttons')
def on_buttons(data):
    """User joins a room"""
    print('buttons changed')

    emit('buttons', {'buttons': json.loads(data['buttons'])}, data['room'])

