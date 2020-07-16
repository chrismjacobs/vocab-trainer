import datetime
import ast
import json
import boto3
from random import randint
from flask import jsonify, request
from run import app, db, bcrypt, s3_resource
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from pprint import pprint
from models import *
from flask_socketio import SocketIO


@app.route("/auth", methods=['GET'])
def auth():
    print ('AUTH', current_user)
    response = {
        'status' : True
    }
    if current_user:
        return jsonify(response)
    else: 
        return jsonify(response)


@app.route("/login", methods=['POST'])
def login():    
    if current_user.is_authenticated:
        return True              
    
    elif username and bcrypt.check_password_hash(user.password, password): #$2b$12$UU5byZ3P/UTtk79q8BP4wukHlTT3eI9KwlkPdpgj4lCgHVgmlj1he  '123'
        login_user (user) # remember=form.remember.data
        return True
    else:
        return False

     
@app.route("/logout", methods=['POST'])
def logout():
    # Logout user
    logout_user()   
    return True


@app.route("/register", methods=['POST']) #and now the form accepts the submit POST
def register():
    print('REGISTER')
    print(request.form, type(request.form))
    print(dict(request.form)) 
    for item in dict(request.form):
        data = json.loads(item)
    
    pprint(data)    
    
    if current_user.is_authenticated:
        return jsonify({'auth' : True})
    
    sID = User.query.filter_by(studentID=data['studentID']).first()
    name = User.query.filter_by(username=data['username']).first()
    email = User.query.filter_by(email=data['email']).first()
    

    if name:
        return jsonify({'error' : 'name'})
    if sID:
        return jsonify({'error' : 'sID'})
    if email:
        return jsonify({'error' : 'email'})
    
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            
    jstring = {}
    bucket_name = 'lms-tester'
    classroom = '1'
    file_name = "jfolder/" + data['username'] + '.json'
        
    s3_resource.Bucket(bucket_name).put_object(Key=file_name, Body=str(jstring))
        
    jocation = "https://lms-tester.s3-ap-northeast-1.amazonaws.com/" + file_name   
        
    user = User(username=data['username'], studentID = data['studentID'], email=data['email'], password = hashed_password, jocation=jocation, school=data['school'])
    
    db.session.add(user)
    db.session.commit()      
    

    response = {
        'success' : 'saved'
    }
    return jsonify(response)

     
    

    



def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request', 
                sender='chrisflask0212@gmail.com', 
                recipients=[user.email])
    msg.body = f'''To reset your password, visit the following link:
    {url_for('reset_token', token=token, _external=True)}
    If you did not request this email then please ignore'''
    #jinja2 template can be used to make more complex emails
    mail.send(msg)


@app.route("/reset_password")
def reset_request():       
    if current_user.is_authenticated:
        return True
     
    else:
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        return True
    

@app.route("/reset_password/<token>")
def reset_token(token):       
    if current_user.is_authenticated:
        return True
    user = User.verify_reset_token(token)
    if user is None:  
        #flash('That is an invalid or expired token', 'warning')
        return False
    
    hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
    user.password = hashed_password
    db.session.commit()
    #flash('Your password has been updated, please login', 'success') 
    return True
    