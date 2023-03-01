import os
import firebase_admin
from firebase_admin import credentials, storage
from collections.abc import Mapping

# Get path to serviceAccKey
cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))
print(cwd)

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
firebase = firebase_admin.initialize_app(cred,{'storageBucket' : 'sentiment-6696b.appspot.com'})
file_path = cwd + '\\src\\backend\\' + "uploadtest.txt"
bucket = storage.bucket() # storage bucket
blob = bucket.blob(file_path)
blob.upload_from_filename(file_path)