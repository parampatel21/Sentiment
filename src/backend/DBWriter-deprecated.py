import os
import firebase_admin
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
def uploadFile(uid, localpath, filename):
    try: 
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(localpath))
        blob.upload_from_filename(filename)
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

def downloadFile(uid, index, tag):
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index) + str(tag))
        blob.download_to_filename(filename=uid + "_" + str(index) + str(tag) )
        
        return True


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
def deleteFile(uid, filename):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(filename))
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


def recordVideo(path,filename):
    # Create an object to read
    # from camera
    video = cv2.VideoCapture(path)

    # We need to check if camera
    # is opened previously or not
    if (video.isOpened() == False):
        print("Error reading video file")

    # We need to set resolutions.
    # so, convert them from float to integer.
    frame_width = int(video.get(3))
    frame_height = int(video.get(4))

    size = (frame_width, frame_height)

    # Below VideoWriter object will create
    # a frame of above defined The output
    # is stored in 'filename.avi' file.
    result = cv2.VideoWriter(filename + '.avi',
                            cv2.VideoWriter_fourcc(*'MJPG'),
                            10, size)
        
    while(True):
        ret, frame = video.read()

        if ret == True:

            # Write the frame into the
            # file 'filename.avi'
            result.write(frame)

            # Display the frame
            # saved in the file
            cv2.imshow('Frame', frame)

            # Press Q on keyboard
            # to stop the process
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # Break the loop
        else:
            break

    # When everything done, release
    # the video capture and video
    # write objects
    video.release()
    result.release()
        
    # Closes all the frames
    cv2.destroyAllWindows()

    return True


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
def sortStorageByTimeStamp(uid, rOrder, filetype):
    try:
        dict_List = []
        bucket = storage.bucket()
        blobs = bucket.list_blobs()
        
            # Find files containing a specific string in their name
        string_to_find = str(uid)
        matching_files = []
        for file in blobs:
            if re.search(string_to_find, file.name) and file.name.endswith(str(filetype)):
                matching_files.append(file)

        # Sort the matching files by creation time
        sorted_files = sorted(matching_files, key=lambda x: x.created, reverse=rOrder)

        # Print the sorted files as a dictionary
        for file in sorted_files:
            print({'name': file.name, 'created': file.time_created})
        

        return sorted_files
    except:
        return False
    
    
    
def sortStorageVideosByRunningCount(uid, rOrder):
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

def sortStorageByTitle(uid, rOrder, filetype):    
    try:
        dict_List = []
        bucket = storage.bucket()
        blobs = bucket.list_blobs()
        
            # Find files containing a specific string in their name
        string_to_find = str(uid)
        matching_files = []
        for file in blobs:
            if re.search(string_to_find, file.name) and file.name.endswith(str(filetype)):
                matching_files.append(file)

        # Sort the matching files by creation time
        sorted_files = sorted(matching_files, key=lambda x: x.name, reverse=rOrder)

        # Print the sorted files as a dictionary
        for file in sorted_files:
            print({'name': file.name, 'created': file.time_created})
        

        return sorted_files
    except:
        return False
        
#print(uploadFile("uid",1, "Script.txt"))
#print(downloadFile(uid="uid", index=1))
#print(readFileToScript(uid="uid", title="A test title", file_path="Script.txt"))
#uploadFile(uid="uid3", index="3", localpath="Script.txt")
#print(sortVideosByRunningCount("uid3", True))

def analyzeVideo(depth, uid, index, tag):

        # Load the video file
        downloadFile(uid= uid, index=index, tag= tag)
        video = Video(uid + "_" + str(index) + str(tag))

        # Initialize the FER detector
        detector = FER()
        
        # Analyze the video frames
        result = video.analyze(detector=detector, display=False, frequency=depth)

        with open('data.csv', 'r') as file, open(uid + "_" + str(index) + '_facial_data.txt', "w") as file2:
            
            file2.write('\nVideo Analysis - Facial Expression\nRaw Emotion Scores:\n')

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


"""
Analyze text emotion
"""
def analyze_text(uid, index):
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
        f.write('\nText Analysis - Emotion\nRaw Emotion Scores:\n')
        for emotion, score in results['raw_emotion_scores'].items():
            f.write(f'{emotion}: {score}\n')
        
        # write the lowest emotion scores
        f.write('\nAreas of possible improvment:\n\tYour lowest emotion scores are as follows. \n\tConsider adjusting your performance to improve on these aspects:\n\n')
        for emotion, score in results['lowest_emotions'].items():
            f.write(f'{emotion}: {score}\n')
    
    with open(uid + "_" + str(index) + "_text_analysis.txt", 'r') as f:    
        return f.read()

def deleteAnalysis(uid, index):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + index + "_text_analysis.txt", 'w')
        blob.delete()
        return True
    except:
        return False

def analyze_overall(uid, index, tag, depth):
    txtOut = analyze_text(uid= uid, index= index)
    vidOut = analyzeVideo(depth=depth, uid= uid, tag= tag, index= index)
   
    with open(uid + "_" + str(index) + "_overall_analysis.txt", 'w') as f:
        # write the raw emotion scores
        f.write(txtOut + vidOut)
    
    
    return txtOut + vidOut
    
def returnFile(uid, index ,tag):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(uid + "_" + str(index) + str(tag))
        file_contents = blob.get().content
        return file_contents
    except Exception as e:
        print(f"Error returning file: {e}")
        return False
    


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

def testVideoAnalysis(uid, filename):
    
    #Ensure no file exists on firestore
    deleteFile(uid=uid,  filename= filename + ".avi")
    deleteFile(uid=uid,  filename= filename + "_facial_data.txt")

    #Pause while show firestore free
    tempContinue = input("Type 'N' to continue\n")
    while tempContinue != "N":
        tempContinue = input("Type 'N' to continue\n")


    #Record and upload video
    uploadFile(uid="uid4", localpath=filename + ".avi", 
               filename=uid + "_" + filename + ".avi") 
    
    #Analyze video, and download as a .csv and a .txt; Upload
    analyzeVideo(filename= uid + "_" + filename + ".avi", depth=30, 
                 outputname= uid + "_" + filename)
    
    uploadFile(uid=uid, localpath= filename + "_facial_data.txt", 
               filename=uid + "_" + filename + "_facial_data.txt")
    
    
    
def testVideoDownload(uid, filename):
    #Pause while manually delete video locally
    tempContinue = input("Type 'N' to continue\n")
    while tempContinue != "N":
        tempContinue = input("Type 'N' to continue\n")
    
    #Download video
    downloadFile(uid=uid,  filename= filename + ".avi")
    downloadFile(uid=uid,  filename= filename + "_facial_data.txt")  
    
    
    
#testVideoAnalysis(uid="uid4",  filename="temp")#
#testVideoDownload(uid="uid4",  filename="temp")

"""FOR UPLOAD/DOWNLOAD:
            Replace the strings '_file_data_txt' w/ whatever metric being measured + format file.
            Essentially, treat this string as a ending 'tag' attached to each video take
            
"""

""""
try:
    bucket = storage.bucket()
    blob = bucket.blob("OWipWjzwyAUokDJFAzPeupi5Rrm2" + "/" + "[object Promise]1.mp4")
    blob.download_to_filename("[object Promise]1.mp4")
    
    print(True)
except:
    print(False)

analyzeVideo("[object Promise]1.mp4", depth=30, 
                 outputname= "[object Promise]")
"""


#Ensure file DNE
#print(deleteFile(uid="uid4", filename= "DNE.avi"))



#sortStorageByTitle(uid="uid4", rOrder=False,filetype=".txt")
#print(sortStorageByTimeStamp(uid="uid4", rOrder=True,filetype=".mp4"))

#uploadFile(uid="uid4", localpath="0.avi", filename="uid4_0.avi")

#writeNewScript(uid="TbyEL0LaRFRQEkgmsIgKhCpGdhq1", title="First Script", script="love love hate")

print(downloadFile(uid="TbyEL0LaRFRQEkgmsIgKhCpGdhq1", index= 3, tag= ".avi"))

#print(analyzeVideo(uid= "TbyEL0LaRFRQEkgmsIgKhCpGdhq1_3", index=1, filename="TbyEL0LaRFRQEkgmsIgKhCpGdhq1_3.avi", depth=30))


print(analyze_overall(uid= "TbyEL0LaRFRQEkgmsIgKhCpGdhq1", index=3, tag=".avi", depth=30))