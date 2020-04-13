from flask import Flask, render_template, jsonify
from flask_cors import CORS
from random import *
import os


app = Flask(__name__, 
        static_folder = "../dist/static",          
        instance_relative_config=True,
        template_folder = "../dist",
        )

## see documentation
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

print(app.template_folder)
import devConfig

app.config.from_object('devConfig.KEYS')


@app.route('/api/random')
def random_number():
    response = { 
        'randomNumber' : randint(1,100)
    }
    return jsonify(response)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


if __name__ == '__main__': 
    app.run()
        