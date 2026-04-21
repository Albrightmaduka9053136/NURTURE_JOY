from database.db import db
from datetime import datetime


class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    id = db.Column(db.String(36), primary_key=True)
    session_id = db.Column(db.String(36), db.ForeignKey("chat_sessions.id"), nullable=False)

    role = db.Column(db.String(20))  # user or assistant
    type = db.Column(db.String(30))  # greeting/chat/safety/resource
    text = db.Column(db.Text)

    link = db.Column(db.String(255), nullable=True)
    quick_replies = db.Column(db.JSON, nullable=True)

    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    session = db.relationship("ChatSession", backref="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "type": self.type,
            "text": self.text,
            "link": self.link,
            "quick_replies": self.quick_replies,
            "timestamp": self.timestamp.isoformat()
        }