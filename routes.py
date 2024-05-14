from flask import Flask, render_template, request, session, redirect


app = Flask(__name__)
app.secret_key = 'secret_key'
session = {}


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', session=session)


@app.route('/about', methods=['GET', 'POST'])
def about():
    return render_template('maps.html', session=session)


