
"""

REMINDER: UPDATE THE CODE ON GOOGLE CLOUD FUNCTIONS EVERY SINGLE TIME YOU PUSH A NEW FEATURE ONTO GITHUB
YOU ALSO NEED TO ADD THE SAID FUNCTION TO firebase_function SUCH THAT IT CAN BE SELECTED VIA ARGUMENTS
THE GOOGLE CLOUD FUNCTION YOU ARE UPDATING IS CALLED: firebase_operational
THE TRIGGER FOR THIS FUNCTION IS: https://us-central1-sentiment-379415.cloudfunctions.net/firebase_operational
MORE INSTRUCTIONS ARE ON GCP GUIDE JS FILE

"""


def master_func(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    import os
    import firebase_admin
    import pytz
    import cv2
    from firebase_admin import credentials, storage, firestore
    from datetime import datetime
    from fer import Video, FER
    import csv
    import time
    import pandas as pd
    import numpy as np

    # Get path to serviceAccKey
    cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

    #Conect to firestore DB via seviceAccKey
    if not firebase_admin._apps:
        cred = credentials.Certificate(cwd + "/serviceAccountKey.json") 
        firebase_admin.initialize_app(cred,{'storageBucket' : 'sentiment-6696b.appspot.com'})
    
    db = firestore.client()

    #Get the timezone object for New York
    tz_NY = pytz.timezone('America/New_York') 
    # Get the current time in New York
    datetime_NY = datetime.now(tz_NY)


    # DEFINE FUNCTION PARAMETERS HERE 
    kwargs_list = list(request.args.items())
    kwargs_dict = dict(kwargs_list)
    if 'selector' in kwargs_dict:
        selector = kwargs_dict.pop('selector')

    def firebase_function(selector, *args, **kwargs):
        if selector == "writeNewUser":
            return writeNewUser(*args, **kwargs)
        elif selector == "modifyUser":
            return modifyUser(*args, **kwargs)
        elif selector == "getRunningCount":
            return getRunningCount(*args, **kwargs)
        elif selector == "getTitle":
            return getTitle(*args, **kwargs)
        elif selector == "readFileToScript":
            return readFileToScript(*args, **kwargs)
        elif selector == "updateRunningCount":
            return updateRunningCount(*args, **kwargs)
        elif selector == "writeNewScript":
            return writeNewScript(*args, **kwargs)
        elif selector == "modifyScript":
            return modifyScript(*args, **kwargs)
        elif selector == "getScript":
            return getScript(*args, **kwargs)
        elif selector == "sortScriptByRunningCount":
            return sortScriptByRunningCount(*args, **kwargs)
        elif selector == "sortScriptByTimeStamp":
            return sortScriptByTimeStamp(*args, **kwargs)
        elif selector == "sortScriptByTitle":
            return sortScriptByTitle(*args, **kwargs)
        elif selector == "sortVideosByRunningCount":
            return sortVideosByRunningCount(*args, **kwargs)
        elif selector == "sortVideosByTitle":
            return sortVideosByTitle(*args, **kwargs)
        elif selector == "analyzeVideo":
            return analyzeVideo(*args, **kwargs)
        else:
            return ("Invalid function selector")
        
    # region (for VScode organization)
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

    def downloadFile(uid, filename):
        try:
            bucket = storage.bucket()
            blob = bucket.blob(uid + "_" + str(filename))
            blob.download_to_filename(uid + "_" + filename)
            
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

    def analyzeVideo(filename, depth, outputname):

        # Load the video file
        video = Video(filename)

        # Initialize the FER detector
        detector = FER()
        
        # Analyze the video frames
        result = video.analyze(detector=detector, display=False, frequency=depth)

        with open('data.csv', 'r') as file, open(outputname + '_facial_data.txt', "w") as file2:

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
            # Select all columns except 'box0'
            cols_to_average = [col for col in df.columns if col != 'box0']

            # Calculate column-wise averages, except for 'box0'
            col_averages = df[cols_to_average].mean()

            # Insert new row for column averages with NULL value for 'box0'
            df = df.append(pd.Series([np.nan] * len(df.columns), index=df.columns), ignore_index=True)
            df.iloc[-1, df.columns.get_loc('box0')] = 'NULL'
            df.iloc[-1, df.columns != 'box0'] = col_averages.values

            # Display the modified dataframe
            file2.write(str(df) + "\n")
            
        return result

    """
    Analyze text emotion
    """
    def analyzeText(uid, index):
        doc = NRCLex(getScript(uid, index))

        # get the raw emotion scores
        emotions = doc.raw_emotion_scores

        # get the lowest three emotion values
        lowest_emotions = sorted(emotions.items(), key=lambda x: x[1])[:3]

        # write the raw emotion scores and the lowest three emotion values to a file
        with open(uid + "_" + index + "_text_analysis.txt", 'w') as f:
            # write the raw emotion scores
            for emotion, score in emotions.items():
                f.write(f'{emotion}: {score}\n')
            # write the lowest three emotion values
            f.write('\nAreas of Possible Improvement:\n')
            for emotion, score in lowest_emotions:
                f.write(f'{emotion}: {score}\n')
        return emotions
    
    def deleteAnalysis(uid, index):
        try:
            bucket = storage.bucket()
            blob = bucket.blob(uid + "_" + index + "_text_analysis.txt", 'w')
            blob.delete()
            return True
        except:
            return False
    # endregion

    return (str(firebase_function(selector, **kwargs_dict)), 200, headers)
