def create_booking(db, booking_data):
    return db.bookings.insert_one(booking_data)

def get_bookings_by_owner(db, owner_id):
    return list(db.bookings.find({"owner_id": owner_id}))

def update_booking_status(db, booking_id, status, parked_place=None):
    update_data = {"status": status}
    if parked_place:
        update_data["parked_place"] = parked_place
    return db.bookings.update_one({"_id": booking_id}, {"$set": update_data})
