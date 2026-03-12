import secrets

from flask import Blueprint, request, jsonify

from werkzeug.security import generate_password_hash, check_password_hash
from database.db import db
from models.user_model import User

auth_bp = Blueprint("auth", __name__)

# ===============================
# REGISTER
# ===============================
@auth_bp.route("/api/auth/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")
    trimester = data.get("trimester")

    # Basic validation
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists
    existing_user = User.query.filter(
        (User.email == email) | (User.username == username)
    ).first()

    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    # Hash password
    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        age=age,
        trimester=trimester
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": new_user.to_dict()
    }), 201



# =====
# token helper function
# =============================
def get_user_from_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    try:
        # Expect: "Bearer <token>"
        token = auth_header.split(" ")[1]
    except IndexError:
        return None

    return User.query.filter_by(api_token=token).first()


# ===============================
# LOGIN
# ===============================
@auth_bp.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate new token
    token = secrets.token_hex(32)
    user.api_token = token
    db.session.commit()

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "token": token
    }), 200

# ===============================
# LOGOUT
# ===============================
@auth_bp.route("/api/auth/logout", methods=["POST"])
def logout():

    user = get_user_from_token()

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user.api_token = None
    db.session.commit()

    return jsonify({
        "message": "Logged out successfully"
    }), 200

# ===============================
# GET CURRENT USER
# ===============================
@auth_bp.route("/api/auth/me", methods=["GET"])
def get_current_user():

    user = get_user_from_token()
    


    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({
        "user": user.to_dict()
    }), 200


# ===============================
# PROTECTED ROUTE (EXAMPLE)
@auth_bp.route("/api/protected", methods=["GET"])
def protected():

    user = get_user_from_token()

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({
        "message": f"Welcome {user.username}! This is protected."
    }), 200

# ==============================
# users
# ==============================
@auth_bp.route("/api/users", methods=["GET"])
def get_all_users():

    users = User.query.all()

    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200


# ==============================
# get user by id
# ==============================
@auth_bp.route("/api/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": user.to_dict()
    }), 200