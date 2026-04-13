import json
import logging
import os

import joblib
from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import db
from logging_config import setup_logging
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.journal_routes import journal_bp
from routes.mood_routes import mood_bp
from routes.metrics_routes import metrics_bp

setup_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config["SECRET_KEY"]

logger.info("Starting NurtureJoy backend")
logger.info("Experiment config loaded | name=%s | version=%s | epochs=%s", app.config["EXPERIMENT_NAME"], app.config["EXPERIMENT_VERSION"], app.config["NUM_EPOCHS"])
logger.info("Feature names configured: %s", ", ".join(app.config["FEATURE_NAMES"]))
logger.info("Expected accuracy levels: %s", app.config["EXPECTED_ACCURACY_LEVELS"])
logger.info("Model hyperparameters: %s", app.config["MODEL_HYPERPARAMETERS"])

app.config["SAFETY_MODEL"] = joblib.load("ml_models/nurturejoy_safety_model_v2.joblib")
app.config["STAGE1_VECTORIZER"] = joblib.load("ml_models/stage1_tfidf.joblib")
app.config["EMOTION_MODEL"] = joblib.load("ml_models/nurturejoy_emotion_model_v2.joblib")
app.config["STAGE2_VECTORIZER"] = joblib.load("ml_models/stage2_tfidf.joblib")
logger.info("ML models loaded successfully")

with open("ml_models/chatbot_templates.json") as f:
    app.config["CHAT_TEMPLATES"] = json.load(f)
logger.info("Chat templates loaded")

CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
db.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(mood_bp)
app.register_blueprint(journal_bp)
app.register_blueprint(metrics_bp)

with app.app_context():
    db.create_all()
    logger.info("Database tables ensured")

@app.route("/")
def home():
    logger.info("Health endpoint hit")
    return {"message": "Nurture Joy Backend Running Successfully"}

@app.route("/api/config-summary")
def config_summary():
    return {
        "experiment_name": app.config["EXPERIMENT_NAME"],
        "experiment_version": app.config["EXPERIMENT_VERSION"],
        "num_epochs": app.config["NUM_EPOCHS"],
        "feature_names": app.config["FEATURE_NAMES"],
        "expected_accuracy_levels": app.config["EXPECTED_ACCURACY_LEVELS"],
        "model_hyperparameters": app.config["MODEL_HYPERPARAMETERS"],
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=os.getenv("FLASK_ENV") != "production")
