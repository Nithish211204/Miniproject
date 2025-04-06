from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from config import SECRET_KEY
from extensions import db  # assuming you have this in your project

mall_bp = Blueprint("mall", __name__)  # Renamed blueprint

# Middleware to protect routes
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

@mall_bp.route("/api/malls", methods=["POST"])
@token_required
def create_mall():
    user = request.user
    if user.get("role") != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    name = data.get("name")
    area = data.get("area")
    district = data.get("district")
    pincode = data.get("pincode")
    phone=data.get("phone")

    if not all([name, area, district,pincode,phone]):
        return jsonify({"error": "Missing required fields"}), 400

    db.shopping_malls.insert_one({
        "name": name,
        "area": area,
        "district": district,
        "pincode": pincode,
        "phone":phone
    })

    return jsonify({"message": "Mall added successfully"}), 201
