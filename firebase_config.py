import firebase_admin
from firebase_admin import credentials, firestore
import os

def initialize_firebase():
    if not firebase_admin._apps:
        # For demo purposes - in production, use service account key
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "iaf-hms-demo",
            "private_key_id": "demo_key_id",
            "private_key": "-----BEGIN PRIVATE KEY-----\nDEMO_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk@iaf-hms-demo.iam.gserviceaccount.com",
            "client_id": "demo_client_id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        })
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

# Mock Firestore for demo
class MockFirestore:
    def __init__(self):
        self.data = {}
    
    def collection(self, name):
        return MockCollection(name, self)
    
class MockCollection:
    def __init__(self, name, db):
        self.name = name
        self.db = db
    
    def stream(self):
        return []
    
    def add(self, data):
        return None
    
    def document(self, doc_id):
        return MockDocument(doc_id, self)

class MockDocument:
    def __init__(self, doc_id, collection):
        self.id = doc_id
        self.collection = collection
    
    def set(self, data):
        pass
    
    def get(self):
        return self

def get_firestore():
    try:
        return initialize_firebase()
    except:
        return MockFirestore()
