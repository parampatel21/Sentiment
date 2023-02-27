from flask import Flask, request
import firebase_admin
import os
from firebase_admin import credentials, storage

app = Flask(__name__)

cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'sentiment-6696b.appspot.com'
})

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    blob = storage.bucket().blob(file.filename)
    blob.upload_from_file(file)
    return 'Upload successful!'

if __name__ == '__main__':
    app.run()
