from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    facility_id = data.get("facility_id")

    if not username or not password or not role:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=username,
        password=generate_password_hash(password),
        role=role,
        facility_id=facility_id
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ CORRECT JWT CREATION
    token = create_access_token(
        identity=str(user.id),           # MUST be a string
        additional_claims={
            "role": user.role
        }
    )

    return jsonify({
        "access_token": token,
        "role": user.role
    }), 200
