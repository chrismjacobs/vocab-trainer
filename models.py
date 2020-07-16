from datetime import datetime, timedelta
from run import app, db, login, bcrypt
from flask_login import UserMixin, current_user # this imports current user, authentication, get id (all the login attributes)
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


#login manager
@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin): #import the model
    id = db.Column(db.Integer, primary_key=True) #kind of value and the key unique to the user
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    username =  db.Column(db.String(20), unique=True, nullable=False) #must be a unique name and cannot be null
    studentID = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(), nullable=False, default='profiles/default.PNG') #images will be hashed to 20 and images could be the same
    password = db.Column(db.String(60), nullable=False)
    school = db.Column(db.String(20), nullable=False)
    jocation = db.Column(db.String(120), unique=True, nullable=False)
    extraStr = db.Column(db.String())
    extraInt = db.Column(db.Integer())

    @classmethod
    def authenticate(cls, **kwargs):
        studentID = kwargs['userData']['studentID']
        password = kwargs['userData']['password']

        print('AUTH', cls, kwargs, studentID, password)
        
        if not studentID or not password:
            print('NONE')
            return None

        user = cls.query.filter_by(studentID=studentID).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            print('PASS FAIL')
            return None
        print('RETURN USER')
        return user

    # help with serializing objects
    def to_dict(self):
        return dict(id=self.id, studentID=self.studentID)

    


class MyModelView(ModelView):
    def is_accessible(self):
        if current_user.is_authenticated:
            if current_user.username == 'Chris':
                return True
            else:
                return False
        else:
            # need to change back to false in production mode
            return True

    #https://danidee10.github.io/2016/11/14/flask-by-example-7.html

    



admin = Admin(app)

admin.add_view(MyModelView(User, db.session))



