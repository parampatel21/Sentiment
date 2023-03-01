import os
import firebase_admin
from firebase_admin import credentials, storage
from collections.abc import Mapping

# Get path to serviceAccKey
cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")

#Access Firebase Storage Bucket
firebase_admin.initialize_app(cred,{'storageBucket' : 'sentiment-6696b.appspot.com'})

def uploadFile(uid, index, localpath):
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index))
    blob.upload_from_filename(localpath)

def downloadFile(uid, index, local_name):
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index))
    blob.download_to_filename(local_name)

#file_path = cwd + '\\src\\backend\\' + "uploadtest.txt"
#uploadFile("uid2", 1, file_path)
#downloadFile("uid2", 1, "dltest.txt")