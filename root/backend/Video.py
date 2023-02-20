#Video object class
import cv2
from textblob import TextBlob as tb
from datetime import datetime
import pytz
import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

datetime_NY = datetime.now(tz_NY)

class Video:
    def __init__(self,userID,title,dateCreated):
        self.userID = userID
        self.title = title
        self.dateCreated = datetime_NY.strftime("%Y:%m:%d:%H:%M:%S")
        self.script = None
    
    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title

    def getDateCreated(self):
        return self.dateCreated

    def setScript(self, script):
        self.script = script

    def setScript(self, script):
        self.script = script