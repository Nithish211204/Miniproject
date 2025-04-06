def create_user(db, user_data):
    return db.users.insert_one(user_data)

def get_user_by_email(db, email):
    return db.users.find_one({"email": email})
