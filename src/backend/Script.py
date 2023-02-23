#Performance script class

#Metric Analysis Libs
from textblob import TextBlob as tb

#Data Managment Libs
from datetime import datetime
import pytz
import os

#Firebase DB Libs
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




class Script:
    def __init__(self,userID,title,scriptContent,scriptIndex, runningCount):
        #ID metadata
        
        self.userID = userID
        self.title = title
        self.dateUpdated = datetime_NY.strftime("%Y:%m:%d:%H:%M:%S")
        self.scriptContent = scriptContent
        self.scriptIndex = scriptIndex
        self.runningCount = runningCount
        
        ###TODO Other report
        self.wordChoiceReport = None
        self.sentenceChoiceReport = None
        
        ###TODO Combined report
        self.combinedReport = None
        self.personalNotes = None
        
        
        # Upload current constructor info to Firstore DB
        currScriptRef = db.collection(self.getUserID() 
                                      + "/Video Index: " 
                                      + str(self.getScriptIndex()) 
                                      + "/Script").document("Script Info ")
        
        currScriptRef.set({"userID" : self.getUserID(),
                                    "title" : self.getTitle(),
                                    "dateUpdated" : self.getDateUpdated(),
                                    "scriptContent" : self.getScriptContent(),
                                    "personalNotes" : self.getPersonalNotes(),
                                    "scriptIndex" : self.getScriptIndex(),
                                    "runningCount" : self.getRunningCount()})
       
               
                    
       
        
    ### Getters and setters 4 Metadata

    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title
        self.updateScriptInfo()
        return True

    def getDateUpdated(self):
        return self.dateUpdated

    def getPersonalNotes(self):
        return self.personalNotes

    def setPersonalNotes(self, personalNotes):
        self.personalNotes = personalNotes
        self.updateScriptInfo()
        return True
    
    def getScriptContent(self):
        return self.scriptContent
    
    def setScriptContent(self, scriptContent):
        self.scriptContent = scriptContent
        self.updateScriptInfo()
        return True
  
    def getScriptIndex(self):
        return self.scriptIndex
  
    def getRunningCount(self):
        return self.runningCount
  
  
    ###Getters & Setters 4 Reports
        #
    def getWordChoiceReport(self):
        return self.wordChoiceReport
    
    def getSenetenceChoiceReport(self):
        return self.sentenceChoiceReport
    
    def getCombinedReport(self):
        return self.combinedReport
  
  
    ###TODO Analysis
    def sentimentAnalysis():
        print(5)
        text = "I had a good day"
        blob = tb(text)
        tags = blob.tags
        print(tags)


        """Upload info into firestore DB; Updates iff userID already exists
        """
 
 
 
    ### DB Magangment
    def updateScriptInfo(self):
        # Test connect
        currScriptRef = db.collection(self.getUserID() 
                                      + "/Video Index: " 
                                      + str(self.getScriptIndex()) 
                                      + "/Script").document("Script Info ")  
              
        currScriptRef.set({"userID" : self.getUserID(),
                                    "title" : self.getTitle(),
                                    "dateUpdated" : self.getDateUpdated(),
                                    "scriptContent" : self.getScriptContent(),
                                    "personalNotes" : self.getPersonalNotes(),
                                    "scriptIndex" : self.getScriptIndex(),
                                    "runningCount" : self.getRunningCount()})
        
        
    
    
###Tester code for creating txt file
def main():
    
    testScript = Script( userID= "PAM", 
           title= "Another New Script",
           scriptContent= "This another script! Neat!",
           scriptIndex= 0,
           runningCount= 5)
    
    testScript.setTitle(" new!")
    testScript.updateScriptInfo()
    
    

    
main()