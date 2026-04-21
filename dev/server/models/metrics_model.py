# models/metrics_model.py

from datetime import datetime, timedelta
from sqlalchemy import func
from database.db import db
from models.mood_model import Mood
from models.journal_model import JournalEntry  # make sure this exists


def calculate_streak(model, user_id, date_field):
    """
    Generic streak calculator for any model
    """

    # Get unique dates (no duplicates per day)
    results = db.session.query(
        func.date(date_field)
    ).filter_by(user_id=user_id)\
     .group_by(func.date(date_field))\
     .order_by(func.date(date_field).desc())\
     .all()

    dates = [r[0] for r in results]

    if not dates:
        return 0

    streak = 0
    today = datetime.utcnow().date()

    for i, date in enumerate(dates):
        expected_date = today - timedelta(days=i)

        if date == expected_date:
            streak += 1
        else:
            break

    return streak


# ==========================
# 🔥 PUBLIC FUNCTIONS
# ==========================

def get_mood_streak(user_id):
    return calculate_streak(Mood, user_id, Mood.created_at)


def get_journal_streak(user_id):
    return calculate_streak(JournalEntry, user_id, JournalEntry.created_at)