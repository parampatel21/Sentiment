import os
import firebase_admin
import pytz
import cv2
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
Get title of a given video

@param uid
    ID which sources the video
@param index
    index of video to be selected
    
@ret title
    Iff successful info pull
@ret False
    Iff unsuccessful info pull

"""
def getTitle(uid, index):
    try:
        videoInfo_ref = db.collection(uid).document(str(index))
        videoInfo = videoInfo_ref.get()
        videoInfo_dict = videoInfo.to_dict()
        
        return videoInfo_dict["title"]
    except:
        return False


def readFileToScript(uid, title, file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            file.close()
            writeNewScript(uid, title, content)
            return True
    except:
        return False


"""
Update a user's running count by 1; Throws error if user DNE

@param uid
    ID for locating user

    

@ret getRunningCount(uid) 
    Updated value fo running count
@ret False iff
    Iff unsuccessful modify
"""
def updateRunningCount(uid):
    try:        
        db.collection(uid).document("access_info").update({"running_count" : getRunningCount(uid=uid) + 1})
        
        return getRunningCount(uid="uid")
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
        "title" : title,
        "index" : getRunningCount(uid) + 1})
    db.collection(uid).document(index).collection("Script").document("script").set({"script" : script,
                                                                                    "index" : getRunningCount(uid) + 1})
    
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
    #try:
        db.collection(uid).document(index).update(
            {"timestamp" : datetime_NY.strftime("%Y:%m:%d:%H:%M:%S"),
            "title" : title})
        db.collection(uid).document(str(index)).collection("Script").document("script").update({"script" : script})
        return True
    #except:
        return False


"""
Get an existing script; Throws error if user DNE

@param uid
    ID for locating user
@param index
    Index of script to be accessed
    
@ret Script
    Iff successful access of script
@ret False
    If unsuccessful access of script
    
    """
def getScript(uid, index):
    try:
        index_ref = db.collection(uid).document(str(index)).collection("Script").document("script")
        index_ref = index_ref.get()
        index_ref_dict = index_ref.to_dict()
        return index_ref_dict["script"]
    except:
        return False

"""
Clear data from an existing script; Throws error if user DNE

@param uid
    ID for locating user
@param index
    Index of script to be cleared

@ret True
    Iff successful clearing of script
@ret False
    If unsuccessful clearing of script
    
    """
def clearScript(uid, index):
    try:
        modifyScript(uid=uid, index=index, title="", script="")
    except:
        return False

"""
Download an existing script; Throws error if user DNE

@param uid
    ID for locating user
@param index
    Index of script to be modified
    
@ret True
    Iff successful modification of script
@ret False
    If unsuccessful modification of script
    
    """
def downloadScript(uid, index):
    try:
        content = getScript(uid, index)
        file_ptr = getTitle(uid=uid, index=index) + ".txt"
        with open(file_ptr, "w") as text_file:
            text_file.write(content)
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
        blob = bucket.blob(uid + "_" + str(index) + "_" + str(localpath))
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

@ret True
    Successful upload
@ret Exception(FileNotFoundError)
    var index is not found
@ret False
    Unsuccessful upload
    
"""

def downloadFile(uid, index):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index))
        file_ptr = getTitle(uid=uid, index=index) + ".mp4" 
        blob.download_to_filename(file_ptr)
        
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

def playVideo(path):
    cap = cv2.VideoCapture(path)
    while cap.isOpened():
        ret, frame = cap.read()
        # if frame is read correctly ret is True
        if not ret:
            print("Can't receive frame (stream end?). Exiting ...")
            break
        color = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        cv2.imshow('frame', color)   
        if cv2.waitKey(1) == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()


def recordVideo():
    cwd = os.getcwd()
    filename = 'temp.mp4'
    frames_per_second = 24.0
    res = '720p'

    def change_res(cap, width, height):
        cap.set(3, width)
        cap.set(4, height)

    STD_DIMENSIONS =  {
        "480p": (640, 480),
        "720p": (1280, 720),
        "1080p": (1920, 1080),
        "4k": (3840, 2160),
    }

    def get_dims(cap, res='1080p'):
        width, height = STD_DIMENSIONS["480p"]
        if res in STD_DIMENSIONS:
            width,height = STD_DIMENSIONS[res]
        change_res(cap, width, height)
        return width, height

    VIDEO_TYPE = {
        'avi': cv2.VideoWriter_fourcc(*'XVID'),
        'mp4': cv2.VideoWriter_fourcc(*'XVID'),
    }

    def get_video_type(filename):
        filename, ext = os.path.splitext(filename)
        if ext in VIDEO_TYPE:
            return  VIDEO_TYPE[ext]
        return VIDEO_TYPE['mp4']

    cap = cv2.VideoCapture(0)
    out = cv2.VideoWriter(cwd + "\\" + filename, get_video_type(filename), 25, get_dims(cap, res))

    while True:
        ret, frame = cap.read()
        out.write(frame)
        cv2.imshow('frame',frame)
        #click q to stop recording
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

"""
Sort all scripts of a user by running count

@param uid
    ID for accessing all scripts to be sorted
@param rOrder
    Reverse order or not

@ret dict_list_sorted
    Successful sorting
@ret False
    Unsuccessful sorting
    
"""
def sortScriptByRunningCount(uid, rOrder):
    try:
        index = getRunningCount(uid=uid)
        dict_List = []
        for temp in range(1,index + 1):
            accessInfo_ref = db.collection(uid).document(str(temp))
            accessInfo_ref = accessInfo_ref.get()
            accessInfo_ref = accessInfo_ref.to_dict()
            dict_List.append(accessInfo_ref)
            
            dict_list_sorted = sorted(dict_List, key=lambda x: x['index'], reverse=rOrder)
            return dict_list_sorted 
    except:
        return False
  
  
"""
Sort all scripts of a user by title

@param uid
    ID for accessing all scripts to be sorted
@param rOrder
    Reverse order or not

@ret dict_list_sorted
    Successful sorting
@ret False
    Unsuccessful sorting
 """  
def sortScriptByTitle(uid, rOrder):
    try:
        index = getRunningCount(uid=uid)
        dict_List = []
        for temp in range(1,index + 1):
            accessInfo_ref = db.collection(uid).document(str(temp))
            accessInfo_ref = accessInfo_ref.get()
            accessInfo_ref = accessInfo_ref.to_dict()
            dict_List.append(accessInfo_ref)
            
        dict_list_sorted = sorted(dict_List, key=lambda x: x['title'], reverse=rOrder)
        return dict_list_sorted
    except:
        return False

"""
Sort all scripts of a user by time stamp

@param uid
    ID for accessing all scripts to be sorted
@param rOrder
    Reverse order or not

@ret dict_list_sorted
    Successful sorting
@ret False
    Unsuccessful sorting
 """  
def sortScriptByTimeStamp(uid, rOrder):
    try:
        index = getRunningCount(uid=uid)
        dict_List = []
        for temp in range(1,index + 1):
            accessInfo_ref = db.collection(uid).document(str(temp))
            accessInfo_ref = accessInfo_ref.get()
            accessInfo_ref = accessInfo_ref.to_dict()
            dict_List.append(accessInfo_ref)
            
        dict_list_sorted = sorted(dict_List, key=lambda x: x['timestamp'], reverse=rOrder)
        return dict_list_sorted
    except:
        return False
    
    
    
def sortVideosByRunningCount(uid, rOrder):
    dict_List = []
    bucket = storage.bucket()
    blobs = bucket.list_blobs()
    blobs_sorted = sorted(blobs, key=lambda x: x.name)
    for blob in blobs_sorted:
        temp = str(blob.name).split("_")
        if str(temp[0]) == str(uid):
            dict_List.append({"uid" : temp[0],
                       "index" : temp[1],
                       "title" : temp[2]})
 
    dict_list_sorted = sorted(dict_List, key=lambda x: x['index'], reverse=rOrder)
    return dict_list_sorted

def sortVideosByTitle(uid, rOrder):
    dict_List = []
    bucket = storage.bucket()
    blobs = bucket.list_blobs()
    blobs_sorted = sorted(blobs, key=lambda x: x.name)
    for blob in blobs_sorted:
        temp = str(blob.name).split("_")
        if str(temp[0]) == str(uid):
            dict_List.append({"uid" : temp[0],
                       "index" : temp[1],
                       "title" : temp[2]})
 
    dict_list_sorted = sorted(dict_List, key=lambda x: x['title'], reverse=rOrder)
    return dict_list_sorted
        
#print(uploadFile("uid",1, "Script.txt"))
#print(downloadFile(uid="uid", index=1))
#print(readFileToScript(uid="uid", title="A test title", file_path="Script.txt"))
#uploadFile(uid="uid3", index="3", localpath="Script.txt")
#print(sortVideosByRunningCount("uid3", True))

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

def testAll():
    #print(writeNewUser(uid="TEST_USER", name="TEST"))
    #print(modifyUser(uid="TEST_USER", name="TEST_NEW_NAME"))
    #print(writeNewScript(uid="TEST_USER",title="SCRIPT_1", script="SCRIPT_1: Script"))

    recordVideo()
    
testAll()
