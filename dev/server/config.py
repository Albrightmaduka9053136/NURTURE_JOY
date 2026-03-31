import json
import os
from dotenv import load_dotenv

load_dotenv()


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ValueError(f"{name} is not set. Add it to your dev/.env file.")
    return value


def _csv_env(name: str, default: str = ""):
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


class Config:
    SECRET_KEY = _required_env("SECRET_KEY")

    DB_USERNAME = _required_env("DB_USERNAME")
    DB_PASSWORD = _required_env("DB_PASSWORD")
    DB_HOSTNAME = _required_env("DB_HOSTNAME")
    DB_PORT = _required_env("DB_PORT")
    DB_NAME = _required_env("DB_NAME")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOSTNAME}:{DB_PORT}/{DB_NAME}?sslmode=require",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_DIR = os.getenv("LOG_DIR", "logs")

    FEATURE_NAMES = _csv_env(
        "FEATURE_NAMES",
        "topic,symptom,support,intensity,safety_label,emotion_label"
    )
    MODEL_HYPERPARAMETERS = os.getenv(
        "MODEL_HYPERPARAMETERS",
        json.dumps({"vectorizer": "tfidf", "ngram_range": "1,2", "rag_min_score": 0.18}),
    )
    EXPECTED_ACCURACY_LEVELS = os.getenv(
        "EXPECTED_ACCURACY_LEVELS",
        json.dumps({"emotion_model": 0.85, "safety_model": 0.92}),
    )
    NUM_EPOCHS = os.getenv("NUM_EPOCHS", "10")
    EXPERIMENT_NAME = os.getenv("EXPERIMENT_NAME", "nurturejoy-emotion-rag")
    EXPERIMENT_VERSION = os.getenv("EXPERIMENT_VERSION", "v5.0")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-5-mini")
    LLM_MIN_CONFIDENCE = os.getenv("LLM_MIN_CONFIDENCE", "0.55")
