import pyrebase
import os
import firebase_admin
from firebase_admin import credentials, storage

config = {
    "apiKey": "AIzaSyBeGxpyW7-XKT4scH41JCzn2Tzb3s7sveY",
    "authDomain": "sentiment-6696b.firebaseapp.com",
    "databaseURL": "https://sentiment-6696b-default-rtdb.firebaseio.com",
    "projectId": "sentiment-6696b",
    "storageBucket": "sentiment-6696b.appspot.com",
    "messagingSenderId": "929145383886",
    "appId": "1:929145383886:web:4059c05a3f9aebca45199f",
    "measurementId": "G-38C03L0RC1"
}

from google.cloud import storage
from google.oauth2 import service_account
def upload_blob(bucket_name, source_file_name, destination_blob_name):
    
    cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

    #Conect to firestore DB via seviceAccKey
    credentials = service_account.Credentials.from_service_account_file(cwd + "/serviceAccountKey.json")    
    firebase_admin.initialize_app(credentials)
    
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    print(f"File {source_file_name} uploaded to {destination_blob_name}.")
    
    
upload_blob(firebase_admin.storage.bucket().name, 'Script.txt', 'images/beatiful_picture.jpg')