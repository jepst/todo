from flask import Flask, request
import flask
import logging
from flask_cors import CORS, cross_origin



# Here we store the current list data.
# There is only one list, shared among all users.
# We keep it in memory, which means the content
# is list if we restart the server. We could
# solve that by instead storing it in a file.

global_data = {
    "the_list": []
}

def data_set_list(value):
    global_data["the_list"] = value

def data_get_list():
    return global_data["the_list"]



def _get_logger(logger_name):
    streamer = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s %(name)s %(filename)s %(levelname)s :: %(message)s")
    streamer.setFormatter(formatter)
    _logger = logging.getLogger(logger_name)
    _logger.setLevel(logging.DEBUG)
    _logger.addHandler(streamer)
    return _logger

logger = _get_logger("TODO")


def create_app():
    app = Flask(__name__)

    # Cross-origin resource sharing
    # required for localhost deployment
    cors = CORS(app)

    @app.route("/api/get_list", methods=['GET'])
    def get_list():
        val = data_get_list()
        logger.info("Application requests list: "+str(val))
        return flask.jsonify(val)

    @app.route("/api/set_list", methods=['POST'])
    def set_list():
        new_list = request.json["the_list"]
        logger.info("Application sets list: "+str(new_list))
        data_set_list(new_list)
        return flask.jsonify("ok")

    return app