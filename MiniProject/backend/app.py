from flask import Flask
from flask_cors import CORS
from extensions import app
from pymongo import MongoClient
import config

app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
CORS(app)

client = MongoClient(config.MONGO_URI)
db = client.smart_parking

# Routes
from routes.auth_routes import auth_bp
from routes.booking_routes import book_bp
from routes.owner_details import mall_bp
from routes.owner_routes import valet_bp
from routes.bookings import user_bp

app.register_blueprint(auth_bp)
app.register_blueprint(book_bp)
app.register_blueprint(mall_bp)
app.register_blueprint(valet_bp)
app.register_blueprint(user_bp)

@app.route('/api/valet/bookings/<int:mall_id>', methods=['GET'])
def get_valet_bookings(mall_id):
    bookings = Booking.query.filter_by(mall_id=mall_id, status='Booked').all()
    return jsonify([b.to_dict() for b in bookings])

@app.route('/api/bookings/<int:booking_id>/park', methods=['POST'])
def park_vehicle(booking_id):
    data = request.json
    slot_number = data.get("slot_number")

    booking = Booking.query.get_or_404(booking_id)
    booking.status = "Parked"
    booking.slot_number = slot_number

    db.session.commit()
    return jsonify({"message": "Updated to Parked", "booking": booking.to_dict()})



if __name__ == "__main__":
    app.run(debug=True)
