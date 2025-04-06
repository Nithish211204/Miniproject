from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from config import SECRET_KEY
from extensions import db

valet_bp = Blueprint("valet", __name__)

# Token Auth Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            token = token.replace("Bearer ", "")
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

@valet_bp.route("/api/add-valet", methods=["POST"])
@token_required
def add_valet():
    user = request.user
    if user.get("role") != "owner":
        return jsonify({"error": "Only owners can add valet parkers"}), 403

    data = request.json
    name = data.get("name")
    phone = data.get("phone")

    if not all([name, phone]):
        return jsonify({"error": "Name and phone number are required"}), 400

    # Check if valet already exists
    existing = db.valets.find_one({"phone": phone})
    if existing:
        return jsonify({"error": "Valet already exists with this number"}), 400

    db.valets.insert_one({
        "name": name,
        "phone": phone,
        "added_by": user["user_id"]
    })

    return jsonify({"message": "Valet added successfully"}), 201
