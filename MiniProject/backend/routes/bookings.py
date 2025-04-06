from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from config import SECRET_KEY
from extensions import db
from bson import ObjectId

user_bp = Blueprint("user", __name__)

# Auth middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
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

@user_bp.route("/api/my-bookings", methods=["GET"])
@token_required
def get_user_bookings():
    user_id = request.user.get("user_id")
    bookings = list(db.bookings.find({"user_id": user_id}))

    for booking in bookings:
        booking["_id"] = str(booking["_id"])  # convert ObjectId to string
        booking["slot_number"] = booking.get("slot_number", "Not assigned")
        booking["status"] = booking.get("status", "pending")

    return jsonify({"bookings": bookings}), 200
