from flask import Flask, request
import flask
import logging
from flask_cors import CORS, cross_origin
import pymysql
import json


def init_db():
    """
    When the server starts, we try to initialize the database by creating
    the `todo` table. If an error occurs, we ignore it, since it probably
    just means the table already exists, which is fine.
    """
    try:
        with pymysql.connect(user="root", password="root", database="sampledb", host="mysql-db", port=3306) as conn:
            with conn.cursor() as cursor:
                cursor.execute('BEGIN')
                cursor.execute('CREATE TABLE todo(id int AUTO_INCREMENT PRIMARY KEY, username varchar(32) unique, thelist text)')
                cursor.execute('COMMIT')      
    except pymysql.err.OperationalError as e:
        logger.warning(f"Can't create `todo` table, maybe already exists? {str(e)}")

def data_set_list(username, value):
    """
    Update a particular user's list in the database.

    First we connect to the database, using the port and hostname specified in docker-compose.yml.
    We use root credentials, which you should never do in a production system!

    First we try to update an existing row for the given user; if that fails, it may be because
    the row doesn't exist yet, so we use insert to add it.
    """
    value = json.dumps(value)
    with pymysql.connect(user="root", password="root", database="sampledb", host="mysql-db", port=3306) as conn:
        with conn.cursor() as cursor:
            cursor.execute('BEGIN')
            result = cursor.execute('update `todo` set thelist=%s where username=%s limit 1', (value, username))
            if result == 0:
                try:
                    cursor.execute('insert into `todo` (thelist, username) values (%s,%s)', (value, username))
                except pymysql.err.IntegrityError:
                    pass
            cursor.execute('COMMIT')      

def data_get_list(username):
    """
    Lookup a particular user's list in the database.

    First we connect to the database, using the port and hostname specified in docker-compose.yml.
    We use root credentials, which you should never do in a production system!

    The db stores the JSON of the list, which we decode into a Python list.
    """
    with pymysql.connect(user="root", password="root", database="sampledb", host="mysql-db", port=3306) as conn:
        with conn.cursor() as cursor:
            cursor.execute("select thelist from todo where username=%s", username)
            result = cursor.fetchone()
            if result is None:
                return None
            else:
                return json.loads(result[0])


def _get_logger(logger_name):
    streamer = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s %(name)s %(filename)s %(levelname)s :: %(message)s")
    streamer.setFormatter(formatter)
    _logger = logging.getLogger(logger_name)
    _logger.setLevel(logging.DEBUG)
    _logger.addHandler(streamer)
    return _logger

logger = _get_logger("TODO")


def get_username():
    """
    Get the currently logged-in user, as specified by the client.
    We first look at the 'username' header, if that doesn't work try a cookie.
    """
    return flask.request.headers.get("username", default=None) or request.cookies.get("username", default=None) or request.args.get("username", default=None)


def create_app():
    """
    Initialize the flask app.
    """    

    app = Flask(__name__)

    # Cross-origin resource sharing
    # required for localhost deployment
    cors = CORS(app)

    # set up database table if it's not already there
    init_db()

    @app.route("/api/get_list", methods=['GET'])
    def get_list():
        username = get_username()
        if not username:
            return flask.make_response("Must be logged in",403)

        val = data_get_list(username)
        if val is None:
            val = []
        logger.info(f"Application requests list for {username}: "+str(val))
        return flask.jsonify(val)

    @app.route("/api/set_list", methods=['POST'])
    def set_list():
        username = get_username()
        if not username:
            return flask.make_response("Must be logged in",403)

        new_list = request.json["the_list"]
        logger.info(f"Application sets list for {username}: "+str(new_list))
        data_set_list(username, new_list)
        return flask.jsonify("ok")

    return app