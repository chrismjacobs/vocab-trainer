from datetime import datetime, timedelta
from app import app, db, bcrypt, DEBUG
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer


class Users(db.Model): #import the model
    id = db.Column(db.Integer, primary_key=True) #kind of value and the key unique to the user
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    username =  db.Column(db.String(20), nullable=False) #must be a unique name and cannot be null
    email = db.Column(db.String(120), unique=True, nullable=False)
    studentID = db.Column(db.String(20))
    vocab = db.Column(db.String(), nullable=False, default='generalW')
    password = db.Column(db.String(60), nullable=False)
    school = db.Column(db.String(30))
    classroom = db.Column(db.String(20))
    extraStr = db.Column(db.String())
    extraInfo = db.Column(db.String())
    extraInt = db.Column(db.Integer())
    connects = db.relationship('Connected', backref='connected')
    classes = db.relationship('Classroom', backref='classroom')


class Tickets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    category = db.Column(db.String())
    device = db.Column(db.String())
    issue = db.Column(db.String())
    reply = db.Column(db.String())
    status = db.Column(db.Integer())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Classroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    instructor = db.Column(db.String(20), nullable=False)
    code = db.Column(db.String(), nullable=False)
    vocab = db.Column(db.String())
    limit = db.Column(db.Integer())
    ids = db.Column(db.String())
    expiry = db.Column(db.Integer())
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Connected(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20), nullable=False)
    friends =  db.Column(db.String())
    sid =  db.Column(db.String())
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

def authenticate(**kwargs): # cls represents iteself in this case User
    email= kwargs['userData']['email']
    password = kwargs['userData']['password']

    print('AUTH', kwargs)

    if not email or not password:
        print('NONE')
        return None

    email = (email.lower()).strip()

    print('CHECK USER')
    user = Users.query.filter_by(email=email).first()
    print(user)

    if not user or not bcrypt.check_password_hash(user.password, password):
        print('PASSWORD FAIL')
        return None

    print('RETURN USER')
    return user



class MyModelView(ModelView):
    def is_accessible(self):
        if DEBUG == True:
            return True
        else:
            return False

    #https://danidee10.github.io/2016/11/14/flask-by-example-7.html


admin = Admin(app)

admin.add_view(MyModelView(Users, db.session))
admin.add_view(MyModelView(Connected, db.session))
admin.add_view(MyModelView(Classroom, db.session))
admin.add_view(MyModelView(Tickets, db.session))



