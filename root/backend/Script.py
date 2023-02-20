#Performance script class

#Sentiment analysis lib
from textblob import TextBlob as tb
import datetime as dt
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




class Script:
    def __init__(self,userID,title,scriptContent):
        #ID metadata
        self.userID = userID
        self.title = title
        self.dateCreated = dt.datetime.now()
        self.scriptContent = scriptContent
        
        ###TODO Emotional analysis report (For video-script comparisson)
        self.emotionalReport = None
        
        ###TODO Other report
        self.wordChoiceReport = None
        self.sentenceChoiceReport = None
        
        ###TODO Combined report
        self.combinedReport = None
        self.personalNotes = None
        
        
        
    ###Getters and setters
    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title
        return True

    def getDateCreated(self):
        return self.dateCreated

    def getPersonalNotes(self):
        return self.personalNotes

    def setPersonalNotes(self, personalNotes):
        self.personalNotes = personalNotes
        return True
    
    def getScriptContent(self):
        return self.scriptContent
    
    def setScriptContent(self, scriptContent):
        self.scriptContent = scriptContent
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


        """Upload info into firestore DB
        """
    def uploadToDB(self):
        # Test connect
        db.collection("Script").add({"userID" : self.getUserID(),
                                    "title" : self.getTitle(),
                                    "dateCreated" : self.getDateCreated(),
                                    "scriptContent" : self.getScriptContent(),
                                    "personalNotes" : self.getPersonalNotes()})
    
    
###Tester code for creating txt file
def main():
    testScript = Script(userID= "ChrisL", 
           title= "New Script",
           scriptContent= "This is a text script. Hello!")
    
    testScript.uploadToDB()

    
main()
