import ast
import json
import sys
import os
import firebase_admin
import pytz
from nrclex import NRCLex
from firebase_admin import credentials, storage, firestore
from datetime import datetime

# Get path to serviceAccKey
cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
firebase_admin.initialize_app(cred,{'storageBucket' : 'sentiment-6696b.appspot.com'})
db = firestore.client()

#Get the timezone object for New York
tz_NY = pytz.timezone('America/New_York') 
# Get the current time in New York
datetime_NY = datetime.now(tz_NY)

def getScript(uid, index):
    try:
        index_ref = db.collection(uid).document(str(index)).get()
        index_data = index_ref.to_dict()
        script = index_data["script"]
        return script
    except KeyError:
        print(f"Key 'script' not found in document {index} of collection {uid}.")
        return False
    except Exception as e:
        print(f"Error getting script from Firestore: {e}")
        return False

def analyze_text(uid, index):
    try:
        doc = NRCLex(getScript(uid, index))
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

input = ast.literal_eval(sys.argv[1])
output = input
output['data_returned'] = analyze_text(output['uid'], output['index'])

print(json.dumps(output))
sys.stdout.flush()