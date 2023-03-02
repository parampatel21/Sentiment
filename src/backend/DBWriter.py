import os
import firebase_admin
import pytz
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

"""
Write a new user

@param uid
    ID for locating user
@ param name
    Name assigned to user
    
@ret True
    Iff successfult write

"""
def writeNewUser(uid, name):
        db.collection(uid).document("access_info").set({"running_count" : 0, "name" : name})
        return True


"""
Modify an existing user, cited by uid; Throws error if uid !exist

@param uid
    ID for locating user
@param name
    Name to replace existing name
    
@ret True 
    Iff successful modify
@ret False iff
    Iff unsuccessful modify
"""
def modifyUser(uid, name):
    try:
        db.collection(uid).document("access_info").update({"name" : name})
        return True
    except:
        return False


"""
Get the running count of a user

@param uid
    ID which sources the runningCount
    
@ret runningCount
    Iff successful info pull
@ret False
    Iff unsuccessful info pull

"""
def getRunningCount(uid):
    try:
        accessInfo_ref = db.collection(uid).document("access_info")
        accessInfo = accessInfo_ref.get()
        accessInfo_dict = accessInfo.to_dict()
        
        return accessInfo_dict["running_count"]
    except:
        return False

"""
Update a user's running count by 1; Throws error if user DNE

@param uid
    ID for locating user
    
@ret True 
    Iff successful modify
@ret False iff
    Iff unsuccessful modify
"""
def updateRunningCount(uid):
    try:
        db.collection(uid).document("access_info").update({"running_count" : getRunningCount(uid=uid) + 1})
        return True
    except:
        return False
    
"""
Write a new Script

@param uid
    ID for locating user
@param title
    Title of script
@param timestamp
    Time stamp of addition
@param script
    Script content
    
@ret True
    Iff successful creation of script
"""
def writeNewScript(uid, title, script):
    #Temp storage of running count
    i = getRunningCount(uid) + 1
    index = str(i)
    
    db.collection(uid).document(index).set(
        {"timestamp" : datetime_NY.strftime("%Y:%m:%d:%H:%M:%S"),
        "title" : title})
    db.collection(uid).document(index).collection("Script").document("script").set({"script" : script})
    
    #Update user's access info running count
    updateRunningCount(uid=uid)
    return True


"""
Modify an existing script; Throws error if user DNE

@param uid
    ID for locating user
@param index
    Index of script to be modified
@param title
    Title of script
@param script
    Script content
    
@ret True
    Iff successful modification of script
@ret False
    If unsuccessful modification of script
    
    """
def modifyScript(uid, index, title, script):
    try:
        db.collection(uid).document(index).update(
            {"timestamp" : datetime_NY.strftime("%Y:%m:%d:%H:%M:%S"),
            "title" : title})
        db.collection(uid).document(index).collection("Script").document("script").update({"script" : script})
        return True
    except:
        return False


modifyScript(uid="uid", index= 1,title="video title",script= "here is my newer script")
#writeNewVideo("uid", "video title", datetime_NY.strftime("%Y:%m:%d:%H:%M:%S"), "here is my script")

def uploadFile(uid, index, localpath):
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index))
    blob.upload_from_filename(localpath)

def downloadFile(uid, index, local_name):
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index))
    blob.download_to_filename(local_name)

def deleteFile(uid, index):
    bucket = storage.bucket()
    blob = bucket.blob(uid + "_" + str(index))
    blob.delete()

deleteFile("uid2",1)

#Test Input & update; Print current running count 
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
            

#main()
