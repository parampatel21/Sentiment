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
    # return jsonify(analyzeVideo(30, uid, index, '.avi'))
    depth = 30
    tag = '.avi'
    index = int(index)
    # Load the video file
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index) + str(tag))
    blob.download_to_filename(filename=uid + "_" + str(index) + str(tag) )
    video = Video(uid + "_" + str(index) + str(tag))

    # Initialize the FER detector
    detector = FER()
    
    # Analyze the video frames
    result = video.analyze(detector=detector, display=False, frequency=depth)

    with open('data.csv', 'r') as file, open(uid + "_" + str(index) + '_facial_data.txt', "w") as file2:
        
        file2.write('\nVideo Analysis - Facial Expression\n----------------------------\nRaw Emotion Scores:\n')

        # Create a CSV reader object
        reader = csv.reader(file)

        # Loop through each row of data and put it into a txt file
        for row in reader:
                file2.write(str(row) + "\n")
                
        file2.write("\n")
        file2.write("Areas of possible improvement:\n")
        file2.write("""\tFinal row is average value of final presentation; 
    Adjust according to desired emotion to be displayed during presentation\n""")
        file2.write("\n")
        
        with open('data.csv', 'r') as f:
            df = pd.read_csv(f)
            
        df.replace("",0)    
            
        # Select all columns except 'box0'
        cols_to_average = [col for col in df.columns if col != 'box0']


        # Calculate column-wise averages, except for 'box0'
        col_averages = df[cols_to_average].mean(skipna=True)

        # create a new DataFrame with the same columns as original plus one extra row
        new_row = pd.DataFrame(columns=df.columns, index=[len(df)])
        # assign NULL to the 'box0' column in the new row
        new_row.loc[len(df), 'box0'] = 'NULL'
        # assign column averages to all columns except 'box0' in the new row
        new_row.loc[len(df), new_row.columns != 'box0'] = col_averages.values
        # concatenate the original DataFrame with the new row
        df = pd.concat([df, new_row])



        # Display the modified dataframe
        file2.write(str(df) + "\n")
        
    # Read the contents of the txt file and return it as a string
    with open(uid + "_" + str(index) + '_facial_data.txt', "r") as file3:
        return file3.read()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8443, ssl_context=('cert.pem', 'key.pem'), debug=True)


