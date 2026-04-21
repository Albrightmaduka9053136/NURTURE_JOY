from database.db import db
from datetime import datetime

class Mood(db.Model):
    __tablename__ = "moods"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    mood = db.Column(db.String(50), nullable=False)
    intensity = db.Column(db.Integer)  # 1–5 scale
    note = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "mood": self.mood,
            "intensity": self.intensity,
            "note": self.note,
            "created_at": self.created_at.isoformat()
        }