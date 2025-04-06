from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from datetime import datetime
import pytz
from config import SECRET_KEY
from extensions import db

book_bp = Blueprint("book", __name__)

# ✅ Middleware for JWT authentication
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

# ✅ Route: Book a parking slot
@book_bp.route("/api/book", methods=["POST"])
@token_required
def book_slot():
    user = request.user

    data = request.get_json()
    car_number = data.get("car_number")
    time_slot = data.get("time_slot")
    district = data.get("district")
    area = data.get("area")
    mall_name = data.get("mall_name")
    pincode = data.get("pincode")

    if not all([car_number, time_slot, district, area, mall_name, pincode]):
        return jsonify({"error": "Missing required fields"}), 400
    ist = pytz.timezone("Asia/Kolkata")
    current_ist_time = datetime.now(ist)
    booking = {
        "user_id": user.get("user_id") or user.get("id"),
        "car_number": car_number,
        "time_slot": time_slot,
        "district": district,
        "area": area,
        "mall_name": mall_name,
        "pincode": pincode,
        "owner_id": "",
        "slot_number": None,
        "status": "booked",
        "booked_at": current_ist_time # ⏰ Booking time
    }

    result = db.bookings.insert_one(booking)

    return jsonify({
        "msg": "Booking successful",
        "booking_id": str(result.inserted_id)
    }), 201

# ✅ Route: Get all malls
@book_bp.route("/api/malls", methods=["GET"])
def get_malls():
    malls = list(db.shopping_malls.find())
    for mall in malls:
        mall["_id"] = str(mall["_id"])  # Convert ObjectId to string
    return jsonify(malls)

