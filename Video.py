#Video object class
import cv2

class Video:
    def __init__(self,userID,title,dateCreated):
        self.userID = userID
        self.title = title
        self.dateCreated = dateCreated
        self.personalNotes = None
    
    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title

    def getDateCreated(self):
        return self.dateCreated
    
    