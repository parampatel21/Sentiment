#User object class
import enum

class User:
    def __init__(self,loginMethod):
        self.userID = None
        self.videoList = None
        self.username = None
        self.email = None
        self.password = None
        self.scriptList = None
        self.loginMethod = loginMethod
    
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

    

class LoginMethod(enum.Enum):
    USERNAME_PASSWORD = 1
    GOOGLE = 2