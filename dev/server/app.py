import os
from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import db
from models.user_model import User
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.mood_routes import mood_bp
from routes.journal_routes import journal_bp
import joblib
import json



app = Flask(__name__)

app.config["SAFETY_MODEL"] = joblib.load("ml_models/nurturejoy_safety_model_v2.joblib")
app.config["STAGE1_VECTORIZER"] = joblib.load("ml_models/stage1_tfidf.joblib")
app.config["EMOTION_MODEL"] = joblib.load("ml_models/nurturejoy_emotion_model_v2.joblib")
app.config["STAGE2_VECTORIZER"] = joblib.load("ml_models/stage2_tfidf.joblib")

with open("ml_models/chatbot_templates.json") as f:
    app.config["CHAT_TEMPLATES"] = json.load(f)
    
    
app.register_blueprint(chat_bp)   # Register chat routes blueprint after defining it in chat_routes.py
app.register_blueprint(mood_bp)   # Register mood routes blueprint after defining it in mood_routes.py
app.register_blueprint(journal_bp)   # Register journal routes blueprint after defining it in journal_routes.py

app.secret_key = os.urandom(24)
# app.config["SESSION_KEY"] = "eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImphbmUifQ.aZQCIw.iuLocljSzNr9SaNzpx6jqWREahY"

app.config.from_object(Config)

CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

db.init_app(app)
    
app.register_blueprint(auth_bp)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {"message": "Nurture Joy Backend Running Successfully"}

if __name__ == "__main__":
    app.run(debug=True)
