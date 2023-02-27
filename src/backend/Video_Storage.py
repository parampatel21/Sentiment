import os
import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase Admin SDK

cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
firebase_admin.initialize_app(cwd, {'storageBucket': 'sentiment-6696b.appspot.com'})

# Define function to upload video to Firebase Storage
def upload_video(file_path, file_name):
    bucket = storage.bucket()
    blob = bucket.blob(file_name)
    blob.upload_from_filename(file_path)

    # Get the public URL of the uploaded video
    url = blob.public_url

    return url
