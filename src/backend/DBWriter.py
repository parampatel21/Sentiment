import os
import firebase_admin
import pytz
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

# Get path to serviceAccKey
cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

#Get the timezone object for New York
tz_NY = pytz.timezone('America/New_York') 
# Get the current time in New York
datetime_NY = datetime.now(tz_NY)

def writeNewUser(uid, name):
    db.collection(uid).document("access_info").set({"running_count" : 0, "name" : name})

def modifyUser(uid, name):
    db.collection(uid).document("access_info").update({"name" : name})

def getVideoIndex(uid):
    running_count = db.collection(uid).document("access_info").get("running_count")
    print(running_count)
    #return int(running_count)

def writeNewVideo(uid, title, timestamp, script):
    i = getVideoIndex(uid) + 1
    index = str(i)
    db.collection(uid).document(index).set(
        {"timestamp" : timestamp,
        "title" : title})
    db.collection(uid).document(index).collection("Video").document("video_info").set()
    db.collection(uid).document(index).collection("Script").document("script").set({"script" : script})

def modifyVideo(uid, index, title, timestamp, script):
    db.collection(uid).document(index).set(
        {"timestamp" : timestamp,
        "title" : title})
    db.collection(uid).document(index).collection("Video").document("video_info").set("")
    db.collection(uid).document(index).collection("Script").document("script").set({"script" : script})

getVideoIndex("uid")
#writeNewUser("uid", "name")
#writeNewVideo("uid", "video title", datetime_NY.strftime("%Y:%m:%d:%H:%M:%S"), "here is my script")
'''
def main():
    choice = 0
    while (choice != 3):
        choice = int(input("Enter 1 for new user, 2 for update, 3 for quit: "))
        if choice == 1:
            print("New User:")
            uid = input("Uid: ")
            name = input("Name: ")
            writeNewUser(uid, name)
        elif choice == 2:
            print("Update User:\n")
            uid = input("Uid: ")
            name = input("Name: ")
            writeNewUser(uid, name)

main()
'''