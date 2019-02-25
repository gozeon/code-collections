import os
from threading import Thread
from datetime import datetime

from flask import Flask, request, make_response, redirect, abort, render_template, url_for, session, flash
from flask_bootstrap import Bootstrap
from flask_moment import Moment
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail, Message

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

app.config['SECRET_KEY'] = 'hard to guess string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.126.com'
app.config['MAIL_PORT'] = 25
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME') or 'liqiushuai@126.com'
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['FLASK_MAIL_SUBJECT_PREFIX'] = '[Flask]'
app.config['FLASK_MAIL_SENDER'] = 'Flask Admin <liqiushuai@126.com>'
app.config['FLASK_ADMIN'] = os.environ.get('FLASK_ADMIN') or 'liqs@jiedaibao.com'

bootstrap = Bootstrap(app)
moment = Moment(app)
db = SQLAlchemy(app)
migrate = Migrate(app)
mail = Mail(app)


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(to, subject, template, **kwargs):
    msg = Message(app.config['FLASK_MAIL_SUBJECT_PREFIX'] + subject,
                  sender=app.config['FLASK_MAIL_SENDER'],
                  recipients=[to])
    msg.body = render_template(template + '.txt', **kwargs)
    msg.html = render_template(template + '.html', **kwargs)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.name


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    def __repr__(self):
        return '<User %r>' % self.username


# @app.route('/')
# def index():
#     return 'Hello world'
#
#
# @app.route('/user/<name>')
# def user(name):
#     return '<h1>Hello {}!</h1>'.format(name)
#
#
# def hello():
#     return 'Hello'
#
#
# app.add_url_rule('/index', 'hello', hello)

# @app.route('/')
# def index():
#     user_agent = request.headers.get("User-Agent")
#     return '<p>Your browser is {}</p>'.format(user_agent)

# @app.route('/')
# def index():
#     response = make_response('<h1>This document carries a cookie!')
#     response.set_cookie('answer', '42')
#     return response

# @app.route('/')
# def index():
#     return redirect('http://www.baidu.com')

# def load_user(id):
#     if id == '1':
#         return {'name': 'tom', 'age': '2'}
#     return None
#
#
# @app.route('/user/<id>')
# def get_user(id):
#     user = load_user(id)
#     if not user:
#         abort(404)
#     print(user)
#     return 'hello {}'.format(user.get('name'))

class NameForm(FlaskForm):
    name = StringField('What is you name?', validators=[DataRequired()])
    submit = SubmitField('Submit')


# @app.route('/', methods=['GET', 'POST'])
# def index():
#     name = None
#     form = NameForm()
#     if form.validate_on_submit():
#         name = form.name.data
#         form.name.data = ''
#     return render_template('index.html', form=form, name=name)

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     form = NameForm()
#     if form.validate_on_submit():
#         session['name'] = form.name.data
#         return redirect(url_for('index'))
#     return render_template('index.html', form=form, name=session.get('name'))

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     form = NameForm()
#     if form.validate_on_submit():
#         old_name = session.get('name')
#         if old_name is not None and old_name != form.name.data:
#             flash('Looks like you have changed your name!')
#         session['name'] = form.name.data
#         return redirect(url_for('index'))
#     return render_template('index.html', form=form, name=session.get('name'))

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     form = NameForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(username=form.name.data).first()
#         if user is None:
#             user = User(username=form.name.data)
#             db.session.add(user)
#             db.session.commit()
#             session['known'] = False
#         else:
#             session['known'] = True
#         session['name'] = form.name.data
#         form.name.data = ''
#         return redirect(url_for('index'))
#     return render_template('index.html',
#                            form=form,
#                            name=session.get('name'),
#                            known=session.get('known', False))

@app.route('/', methods=['GET', 'POST'])
def index():
    form = NameForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.name.data).first()
        if user is None:
            user = User(username=form.name.data)
            db.session.add(user)
            session['known'] = False
            if app.config['FLASK_ADMIN']:
                send_email(app.config['FLASK_ADMIN'], 'New User', 'mail/new_user', user=user)
        else:
            session['known'] = True
        session['name'] = form.name.data
        form.name.data = ''
        return redirect(url_for('index'))
    return render_template('index.html',
                           form=form,
                           name=session.get('name'),
                           known=session.get('known', False))


@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


@app.shell_context_processor
def make_all_context():
    return dict(db=db, User=User, Role=Role)
