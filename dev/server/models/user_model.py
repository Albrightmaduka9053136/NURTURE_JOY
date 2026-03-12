from database.db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    age = db.Column(db.Integer)

    trimester = db.Column(db.Integer)


    api_token = db.Column(db.String(128), nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relationship placeholders (for later)
    # moods = db.relationship("Mood", backref="user")
    # chats = db.relationship("ChatMessage", backref="user")

    def to_dict(self):
        """
        Converts object to dictionary (useful for API responses)
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "age": self.age,
            "trimester": self.trimester,
            "created_at": self.created_at
        }

    def __repr__(self):
        return f"<User {self.username}>"
