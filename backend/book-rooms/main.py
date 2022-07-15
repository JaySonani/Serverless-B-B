import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def main(request):
    request_json = request.get_json()

    user_id = request_json['user_id']
    checkin_date = request_json['checkin_date']
    checkout_date = request_json['checkout_date']
    room_type = request_json['room_type']
    rooms_qty = request_json['rooms_qty']

    cred = credentials.ApplicationDefault()

    default_app = firebase_admin.initialize_app(cred, {
    'projectId': 'serverlessbnb-354422',
    })
    
    db = firestore.client()
    booked_rooms = db.collection('booked_rooms')

    booking = {}
    doc_ref = booked_rooms.document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        booking = doc.to_dict()

    booking[room_type] = {
      "checkin_date": checkin_date,
      "checkout_date": checkout_date,
      "rooms_qty": rooms_qty
    }

    doc_ref.set(booking)

    return {
      "message": "Booking created successfully",
      "success": True,
      "booking_details": booking[room_type]
    }