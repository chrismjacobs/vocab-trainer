from datetime import datetime, timedelta
from app import app, db, bcrypt
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


class User(db.Model): #import the model
    id = db.Column(db.Integer, primary_key=True) #kind of value and the key unique to the user
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    username =  db.Column(db.String(20), unique=True, nullable=False) #must be a unique name and cannot be null
    email = db.Column(db.String(120), unique=True, nullable=False)
    studentID = db.Column(db.String())
    vocab = db.Column(db.String(), nullable=False, default='tourism')
    image_file = db.Column(db.String(), nullable=False, default='public/profiles/default.PNG') #images will be hashed to 20 and images could be the same
    password = db.Column(db.String(60), nullable=False)
    school = db.Column(db.String(20))
    classroom = db.Column(db.String(20))
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())
    connects = db.relationship('Connected', backref='connected')
    rooms = db.relationship('Room', secondary='ready', backref=db.backref('players', lazy='dynamic'))


class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    settings =  db.Column(db.String(), unique=True, nullable=False)
    count = db.Column(db.Integer(), unique=False, nullable=False)
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())


class Connected(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20), nullable=False) #must be a unique name and cannot be null
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String())

association_table = db.Table('ready',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('room_id', db.Integer, db.ForeignKey('room.id'))
)

def authenticate(**kwargs): # cls represents iteself in this case User
    email= kwargs['userData']['email']
    password = kwargs['userData']['password']

    print('AUTH', kwargs)

    if not email or not password:
        print('NONE')
        return None

    print('CHECK USER')
    user = User.query.filter_by(email=email).first()
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
admin.add_view(MyModelView(Room, db.session))



