from database.db import db
from datetime import datetime


class ChatSession(db.Model):
    __tablename__ = "chat_sessions"

    id = db.Column(db.String(36), primary_key=True)  # UUID
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)

    turns = db.Column(db.Integer, default=0)
    ended = db.Column(db.Boolean, default=False)

    user = db.relationship("User", backref="chat_sessions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "ended": self.ended,
            "turns": self.turns
        }
