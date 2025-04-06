
from flask import Blueprint, request, jsonify
from extensions import db
import jwt, datetime
from config import SECRET_KEY
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/login", methods=["POST"])
def login_or_register():
    data = request.json
    phone = data.get("phone")
    name = data.get("name")

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400

    # Check admin collection
    admin = db.admin.find_one({"phone": phone})
    if admin:
        token = jwt.encode({
            "user_id": str(admin["_id"]),
            "phone": admin["phone"],
            "role": "admin",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)
        return jsonify({"token": token, "name": admin["name"], "role": "admin"}), 200

    # Check owner collection
    owner = db.shopping_malls.find_one({"phone": phone})
    if owner:
        token = jwt.encode({
            "user_id": str(owner["_id"]),
            "phone": owner["phone"],
            "role": "owner",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)
        return jsonify({"token": token, "name": owner["name"], "role": "owner"}), 200

    # Check valet collection
    valet = db.valets.find_one({"phone": phone})
    if valet:
        token = jwt.encode({
            "user_id": str(valet["_id"]),
            "phone": valet["phone"],
            "role": "valet",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)
        return jsonify({"token": token, "name": valet["name"], "role": "valet"}), 200

    # Check users collection
    user = db.users.find_one({"phone": phone})
    if user:
        token = jwt.encode({
            "user_id": str(user["_id"]),
            "phone": user["phone"],
            "role": "user",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)
        return jsonify({"token": token, "name": user["name"], "role": "user"}), 200

    # If not found anywhere, treat as new user and ask for name
    if not name:
        return jsonify({"new_user": True}), 200

    # Register as a new user (default role = user)
    new_user = {
        "phone": phone,
        "name": name,
        "role": "user"
    }
    result = db.users.insert_one(new_user)

    token = jwt.encode({
        "user_id": str(result.inserted_id),
        "phone": phone,
        "role": "user",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY)

    return jsonify({"token": token, "name": name, "role": "user"}), 201
