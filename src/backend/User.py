#User object class
import enum
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Get path to serviceAccKey
cwd = os.path.dirname(os.path.realpath("serviceAccountKey.json"))

#Conect to firestore DB via seviceAccKey
cred = credentials.Certificate(cwd + "/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

class User:
    def __init__(self,userID, loginMethod):
        self.userID = userID
        self.index = None
        self.videoList = None
        self.username = None
        self.email = None
        self.password = None
        self.scriptList = None
        self.loginMethod = loginMethod
        self.runningCount = 0
        
        
        # Upload current constructor info to Firstore DB
        currUserRef = db.collection(self.getUserID()).document("Access Info")
        
        currUserRef.set({"userID" : self.getUserID(),
                         "runningCount" : self.getRunningCount()})
        
        
        
    
    def getUserID(self):
        return self.userID
    
    def getVideoList(self):
        return self.videoList
    
    def getUsername(self):
        if self.loginMethod == 1:
            return self.userID
        else:
            return self.email
        
    def setUsername(self, username):
        self.username = username
    
    def getScriptList(self):
        return self.scriptList
    
    def getLoginMethod(self):
        return self.loginMethod
    
    def addVideo(self, video):
        self.videoList.add(video)

    def removeVideo(self, video):
        self.videoList.remove(video)

    def getRunningCount(self):
        return self.runningCount

    def writeToDB(item):
        currScriptRef = db.collection(item.getUserID()).document(str(20))
 
        currScriptRef.set({"userID" : item.getUserID(),
                                    "index" : 0})
         

    

class LoginMethod(enum.Enum):
    USERNAME_PASSWORD = 1
    GOOGLE = 2
    
    
###Tester code for creating user 
def main():
    testUser = User(userID= "PAM", loginMethod= 1)
    


    
main()