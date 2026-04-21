# routes/metrics_routes.py

from flask import Blueprint, jsonify
from routes.auth_routes import get_user_from_token
from models.metrics_model import get_mood_streak, get_journal_streak

metrics_bp = Blueprint("metrics", __name__)


@metrics_bp.route("/api/metrics/streaks", methods=["GET"])
def get_streaks():
    user = get_user_from_token()

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        mood_streak = get_mood_streak(user.id)
        journal_streak = get_journal_streak(user.id)

        return jsonify({
            "moodStreak": mood_streak,
            "journalStreak": journal_streak
        }), 200

    except Exception as e:
        print("Error fetching streaks:", e)
        return jsonify({"error": "Server error"}), 500