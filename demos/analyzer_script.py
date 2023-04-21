import os
import firebase_admin
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytz
from nrclex import NRCLex
import cv2
from firebase_admin import credentials, storage, firestore
from datetime import datetime
from fer import Video, FER
import csv
import time
import pandas as pd
import numpy as np
import re
import json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def index():
    data = request.get_data()
    data_dict = json.loads(data)
    print(data_dict)

    # Get path to serviceAccKey
    cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

    if not firebase_admin._apps:
        cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
        firebase_admin.initialize_app(cred,{'storageBucket' : 'sentiment-6696b.appspot.com'})

    db = firestore.client()
    uid = data_dict['uid']
    index = data_dict['index']
    print(index)
    index = int(index)
    index_ref = db.collection(uid).document(str(index)).get()
    index_data = index_ref.to_dict()
    script = index_data["script"]
    doc = NRCLex(script)
    emotions = doc.raw_emotion_scores
    
    # create a dictionary to store the results
    results = {}
    results['raw_emotion_scores'] = emotions
    
    # get the lowest 3 values from my_dict1 and any ties that exceed the lowest 3
    lowest_values = [item for item in sorted(results['raw_emotion_scores'].items(), key=lambda x: x[1])[:3]]
    ties = set([item for item in sorted(results['raw_emotion_scores'].items(), key=lambda x: x[1])[3:] if item[1] == lowest_values[-1][1]])

    # add any ties to the lowest 3 values and convert the result to a dictionary for my_dict1
    result = {item[0]: item[1] for item in lowest_values} 
    result.update({item[0]: item[1] for item in sorted(ties)})
    
    results['lowest_emotions'] = result

    string = '\nText Analysis - Emotion\n----------------------------\nRaw Emotion Scores:\n'
    for emotion, score in results['raw_emotion_scores'].items():
        string = string + f'{emotion}: {score}\n'
    #improvement
    string += '\nAreas of possible improvement:\n\tYour lowest emotion scores are as follows. \n\tConsider adjusting your performance to improve on these aspects:\n\n'
    for emotion, score in results['lowest_emotions'].items():
        string = string + f'{emotion}: {score}\n'
    print(string)
    return string

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context=('cert.pem', 'key.pem'), debug=True)


