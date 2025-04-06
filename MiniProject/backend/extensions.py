# backend/extensions.py
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import config

app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
CORS(app)

client = MongoClient(config.MONGO_URI)
db = client.smart_parking
