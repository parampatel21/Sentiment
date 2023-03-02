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
Update a user's running count by num; Throws error if user DNE

@param uid
    ID for locating user
@param num
    Running count adjustment number; Can be negative
    
@ret Exception(Arg num error)
    Adjustment to running count results in a number less than 0
@ret True 
    Iff successful modify
@ret False iff
    Iff unsuccessful modify
"""
def updateRunningCount(uid, num):
    try:
        rCount = getRunningCount(uid=uid)
        if (rCount + num < 0):
            return Exception("Arg num error")
        
        db.collection(uid).document("access_info").update({"running_count" : rCount + num})
        
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
    increaseRunningCount(uid=uid)
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


"""
Upload a file into firestore storage; Throws error if unsuccessful; Overwrites if already exists

@param uid
    ID for defining user to make
@param index
    Index of file to be uploaded
@param localpath
    localpath of file to be uploaded

@ret True
    Successful upload
@ret Exception(FileNotFoundError)
    var localpath is not found
@ret False
    Unsuccessful upload
    
"""
def uploadFile(uid, index, localpath):
    try: 
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index))
        blob.upload_from_filename(localpath)
        return True
    except FileNotFoundError:
        #Should not be thrown iff UI implemented correctly
        return Exception("FileNotFoundError")
    except:
        return False


"""
Download a file from firestore storage; Throws error if unsuccessful

@param uid
    ID for locating user to download from
@param index
    Index of file to be downloaded
@param localname
    Name of file to be downloaded, as named in Firebase storage

@ret True
    Successful upload
@ret Exception(FileNotFoundError)
    var local_name is not found
@ret False
    Unsuccessful upload
    
"""
def downloadFile(uid, index, local_name):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index))
        blob.download_to_filename(local_name)
        return True
    except FileNotFoundError:
        #Should not be thrown iff UI implemented correctly
        return Exception("FileNotFoundError") 
    except:
        return False

"""
Delete a file from firestore storage; Throws error if unsuccessful

@param uid
    ID for locating user to delete
@param index
    Index of file to be deleted

@ret True
    Successful upload
@ret False
    Unsuccessful upload
    
"""
def deleteFile(uid, index):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index))
        blob.delete()
        return True
    except:
        return False

#print(uploadFile("uid",1, "Script.txt"))
print(downloadFile("uid", 1, "Script.txt"))

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
