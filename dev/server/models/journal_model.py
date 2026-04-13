from database.db import db
from datetime import datetime

class JournalEntry(db.Model):
    __tablename__ = "journal_entries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    prompt = db.Column(db.String(255))
    title = db.Column(db.String(255))  # New title field
    content = db.Column(db.Text, nullable=False)
    label = db.Column(db.String(255))  # Store label as a single string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "prompt": self.prompt,
            "title": self.title,
            "content": self.content,
            "label": self.label,
            "created_at": self.created_at.isoformat()
        }