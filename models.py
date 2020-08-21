from datetime import datetime, timedelta
from app import app, db, bcrypt
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


class User(db.Model): #import the model
    id = db.Column(db.Integer, primary_key=True) #kind of value and the key unique to the user
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    username =  db.Column(db.String(20), nullable=False) #must be a unique name and cannot be null
    studentID = db.Column(db.String())
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(), nullable=False, default='profiles/default.PNG') #images will be hashed to 20 and images could be the same
    password = db.Column(db.String(60), nullable=False)
    school = db.Column(db.String(20))
    jocation = db.Column(db.String(120), unique=True, nullable=False)
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    settings =  db.Column(db.String(), unique=True, nullable=False)
    count = db.Column(db.Integer(), unique=False, nullable=False)
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())

class Connect(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20), nullable=False) #must be a unique name and cannot be null
    studentID = db.Column(db.String(), nullable=False)

class Connected(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20), nullable=False) #must be a unique name and cannot be null
    studentID = db.Column(db.String(), nullable=False)
    room = db.Column(db.String())
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())




def authenticate(**kwargs): # cls represents iteself in this case User
    studentID = kwargs['userData']['studentID']
    password = kwargs['userData']['password']

    print('AUTH', kwargs)

    if not studentID or not password:
        print('NONE')
        return None

    print('CHECK USER')
    user = User.query.filter_by(studentID=studentID).first()
    print(user)

    if not user or not bcrypt.check_password_hash(user.password, password):
        print('PASS FAIL')
        return None

    print('RETURN USER')
    return user






class MyModelView(ModelView):
    def is_accessible(self):
        return True

    #https://danidee10.github.io/2016/11/14/flask-by-example-7.html





admin = Admin(app)

admin.add_view(MyModelView(User, db.session))
admin.add_view(MyModelView(Settings, db.session))
admin.add_view(MyModelView(Connected, db.session))



