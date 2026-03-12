from flask import Blueprint, request, jsonify
from models.journal_model import JournalEntry
from database.db import db
from routes.auth_routes import get_user_from_token

journal_bp = Blueprint("journal", __name__)

# ==========================
# GET RANDOM JOURNAL PROMPT
# ==========================
@journal_bp.route("/api/journal/prompt", methods=["GET"])
def get_prompt():

    prompts = [
        "What are you grateful for today?",
        "Describe how you felt today and why.",
        "What is one small win you had today?",
        "What is something you are looking forward to?",
        "What emotion did you feel most strongly today?"
    ]

    import random
    return jsonify({"prompt": random.choice(prompts)}), 200


# ==========================
# SAVE JOURNAL ENTRY
# ==========================
@journal_bp.route("/api/journal", methods=["POST"])
def save_journal():

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    prompt = data.get("prompt")
    content = data.get("content")

    if not content:
        return jsonify({"error": "Journal content required"}), 400

    entry = JournalEntry(
        user_id=user.id,
        prompt=prompt,
        content=content
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({
        "message": "Journal saved successfully",
        "entry": entry.to_dict()
    }), 201


# ==========================
# GET USER JOURNALS
# ==========================
@journal_bp.route("/api/journal", methods=["GET"])
def get_journals():

    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    entries = JournalEntry.query.filter_by(user_id=user.id)\
        .order_by(JournalEntry.created_at.desc())\
        .all()

    return jsonify({
        "entries": [e.to_dict() for e in entries]
    }), 200