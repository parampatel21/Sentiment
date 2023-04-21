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

    #Get the timezone object for New York
    tz_NY = pytz.timezone('America/New_York') 
    # Get the current time in New York
    datetime_NY = datetime.now(tz_NY)

    selector = data_dict['selector']
    uid = data_dict['uid']
    index = data_dict['index']
    print(index)
    if selector == 1:
            index = int(index)
            try:
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
                
                # write the results to the output file
                with open(uid + "_" + str(index) + "_text_analysis.txt", 'w') as f:
                    # write the raw emotion scores
                    f.write('\nText Analysis - Emotion\n----------------------------\nRaw Emotion Scores:\n')
                    for emotion, score in results['raw_emotion_scores'].items():
                        f.write(f'{emotion}: {score}\n')
                    
                    # write the lowest emotion scores
                    f.write('\nAreas of possible improvment:\n\tYour lowest emotion scores are as follows. \n\tConsider adjusting your performance to improve on these aspects:\n\n')
                    for emotion, score in results['lowest_emotions'].items():
                        f.write(f'{emotion}: {score}\n')
                
                with open(uid + "_" + str(index) + "_text_analysis.txt", 'r') as f:    
                    return f.read()
            except ValueError as e:
                return f"ValueError: {e}"
            except FileNotFoundError as e:
                return f"FileNotFoundError: {e}"
            except IOError as e:
                return f"IOError: {e}"
            except:
                return f"Unkown Error: {e}"
    elif selector == 2:
        # return jsonify(analyzeVideo(30, uid, index, '.avi'))
        depth = 30
        tag = 'avi'
        index = int(index)
        try:
            # Load the video file
            # downloadFile(uid= uid, index=index, tag= tag)
            index = int(index)
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
                file2.write("Areas of possible improvment:\n")
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

                # Insert new row for column averages with NULL value for 'box0'
                df = df.append(pd.Series([np.nan] * len(df.columns), index=df.columns), ignore_index=True)
                df.iloc[-1, df.columns.get_loc('box0')] = 'NULL'
                df.iloc[-1, df.columns != 'box0'] = col_averages.values

                # Display the modified dataframe
                file2.write(str(df) + "\n")
                
            # Read the contents of the txt file and return it as a string
            with open(uid + "_" + str(index) + '_facial_data.txt', "r") as file3:
                return file3.read()
        except ValueError as e:
            return f"ValueError: {e}"
        except FileNotFoundError as e:
            return f"FileNotFoundError: {e}"
        except IOError as e:
            return f"IOError: {e}"
        except:
            return f"Unkown Error: {e}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context=('cert.pem', 'key.pem'), debug=True)


