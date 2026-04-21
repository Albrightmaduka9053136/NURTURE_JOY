from models.user import User
from database.db import db
from flask import request


def authenticate_request():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None, "Missing Authorization header"

    if not auth_header.startswith("Bearer "):
        return None, "Invalid Authorization format"

    token = auth_header.split(" ")[1]

    user = User.query.filter_by(api_token=token).first()

    if not user:
        return None, "Invalid or expired token"

    return user, None