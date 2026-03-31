from flask import Blueprint, request, jsonify
from database.db import db
from models.mood_model import Mood
from routes.auth_routes import get_user_from_token

mood_bp = Blueprint("mood", __name__)


@mood_bp.route("/api/mood/track", methods=["POST"])
def track_mood():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()

    mood = data.get("mood")
    intensity = data.get("intensity")
    note = data.get("note")

    if not mood:
        return jsonify({"error": "Mood required"}), 400

    new_mood = Mood(
        user_id=user.id,
        mood=mood,
        intensity=intensity,
        note=note
    )

    db.session.add(new_mood)
    db.session.commit()

    return jsonify({
        "message": "Mood logged successfully",
        "mood": new_mood.to_dict()
    }), 201
    
# get mood history for user
@mood_bp.route("/api/mood/history", methods=["GET"])
def mood_history():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    moods = Mood.query.filter_by(user_id=user.id)\
        .order_by(Mood.created_at.desc())\
        .all()

    return jsonify({
        "moods": [m.to_dict() for m in moods]
    }), 200
    
    
# get mood summary (frequency of each mood)
from sqlalchemy import func

@mood_bp.route("/api/mood/summary", methods=["GET"])
def mood_summary():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    results = db.session.query(
        Mood.mood,
        func.count(Mood.id)
    ).filter_by(user_id=user.id)\
     .group_by(Mood.mood)\
     .all()

    summary = {mood: count for mood, count in results}

    return jsonify({
        "summary": summary
    }), 200