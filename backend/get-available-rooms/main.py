import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def main(request):
    request_json = request.get_json()
    requested_dates = request_json['dates']

    cred = credentials.ApplicationDefault()

    default_app = firebase_admin.initialize_app(cred, {
    'projectId': 'serverlessbnb-354422',
    })
    
    db = firestore.client()
    available_rooms = db.collection('available_rooms')

    response = {}

    for each_date in requested_dates:
        doc_ref = available_rooms.document(each_date)
        doc = doc_ref.get()
        if doc.exists:
            response[each_date] = doc.to_dict()
        else:
            continue

    return response