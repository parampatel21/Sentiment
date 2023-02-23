#Performance script class

#Sentiment analysis lib
from textblob import TextBlob as tb
from datetime import datetime
import pytz
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

#Get the timezone object for New York
tz_NY = pytz.timezone('America/New_York') 

# Get the current time in New York
datetime_NY = datetime.now(tz_NY)

temp = datetime_NY.strftime("%Y:%m:%d:%H:%M:%S")

class Script:
    def __init__(self,userID,title,scriptContent):
        #ID metadata
        
        self.userID = userID
        self.title = title
        self.dateCreated = temp
        self.dateUpdated = datetime_NY.strftime("%Y:%m:%d:%H:%M:%S")
        self.scriptContent = scriptContent
        
        ###TODO Emotional analysis report (For video-script comparisson)
        self.emotionalReport = None
        
        ###TODO Other report
        self.wordChoiceReport = None
        self.sentenceChoiceReport = None
        
        ###TODO Combined report
        self.combinedReport = None
        self.personalNotes = None
        
        
        # Upload current constructor info to Firstore DB
        currScriptRef = db.collection("Script").document("" + self.getDateCreated())
        
        currScriptRef.set({"userID" : self.getUserID(),
                                    "title" : self.getTitle(),
                                    "dateCreated" : self.getDateCreated(),
                                    "dateUpdated" : self.getDateUpdated(),
                                    "scriptContent" : self.getScriptContent(),
                                    "personalNotes" : self.getPersonalNotes()})
        
        
        
    ###Getters and setters
    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title
        self.updateToDB()
        return True

    def getDateCreated(self):
        return self.dateCreated

    def getDateUpdated(self):
        return self.dateUpdated

    def getPersonalNotes(self):
        return self.personalNotes

    def setPersonalNotes(self, personalNotes):
        self.personalNotes = personalNotes
        self.updateToDB()
        return True
    
    def getScriptContent(self):
        return self.scriptContent
    
    def setScriptContent(self, scriptContent):
        self.scriptContent = scriptContent
        self.updateToDB()
        return True
   
   
   
        """TODO Create formatted text file & download to user's download folder
        """
    def downloadScript(self):
       with open("Script.txt", "w") as text_file:
        text_file.write("User ID: %s\n" % self.getUserID())
        text_file.write("Date Created: %s\n" %self.getDateCreated())
        text_file.write("Current Script: %s\n" % self.getScriptContent())
         
        
    ###TODO
    def sentimentAnalysis():
        print(5)
        text = "I had a good day"
        blob = tb(text)
        tags = blob.tags
        print(tags)


        """Upload info into firestore DB; Updates iff userID already exists
        """
    def updateToDB(self):
        # Test connect
        currScriptRef = db.collection("Script").document("" + self.getDateCreated())
        
        currScriptRef.set({"userID" : self.getUserID(),
                                    "title" : self.getTitle(),
                                    "scriptContent" : self.getScriptContent(),
                                    "personalNotes" : self.getPersonalNotes()})
    
    
###Tester code for creating txt file
def main():
    testScript = Script(userID= "Not ChrisL", 
           title= "New Script",
           scriptContent= "This text script! Wow!")
    
    testScript.setTitle("A New-ish Script")
    testScript.setPersonalNotes("See this too many times!")
    testScript.updateToDB()
    
main()