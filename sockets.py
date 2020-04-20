import sys, boto3, random
import random
from datetime import datetime, timedelta
import ast
import json
from flask import render_template, url_for, flash, redirect, request, abort, jsonify  
from app import app, db, bcrypt, socketio, login
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from forms import LoginForm
from pprint import pprint
from models import *
from flask_socketio import SocketIO, join_room, leave_room, send, emit


@socketio.on('connect')
def on_connect():
    """User connects"""
    print('connect_python')
    send({"username": current_user.username})


@socketio.on('join')
def on_join(data):
    """User joins a room"""
    print('join started')
    player_game = set_game(None)
    #return {'player': player, 'game': game 'qString': qString}
    if player_game == None:
        return 'ERROR - No Game Set'
    print (player_game)
    room = player_game['room']
    player = player_game['player']
    qString = player_game['qString']
    pDict = player_game['pDict']
    qs = player_game['qs']
    
    join_room(room)      
    
    emit('playerReady', {'player': player, 'room': room, 'qString': qString, 'pDict': pDict, 'qs': qs}, room=room)

@socketio.on('bot')
def bot_mode(data):
    Games = set_environment()[0] 

    room = data['room']
    gameID = int(room.split('_')[0])
    #using 'room' as an argument means the bot will be loaded
    player_game = set_game(room)  
    qs = player_game['qs'] 
    pDict = player_game['pDict']      

    game = Games.query.filter_by(id=gameID).first()
    results = ast.literal_eval(game.results)
    
    botDict = {}
    count = 1
    for vocab in results:
        botDict[count] = results[vocab]['Bot'][1]        
        count += 1
    print ('botDict ', botDict)

    emit('botReady', {'pDict': pDict, 'botDict': botDict, 'qs':qs}, room=room)


@socketio.on('choice_made')
def choice_made(data):
    print ('choice', data)  

    room = data['room']
    username = data['username'] 
    player = data['player']  
    
    socketio.emit('turn', {'player' : player}, room=room)



@socketio.on('disconnect')
def test_disconnect():
    print('Client Disconnected')