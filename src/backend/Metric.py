#Emotional Analysis Metric class- to be implemented in later sprint
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



class Metric:
    def __init__(self,userID,metricName,metricIndex, runningCount):
        #ID metadata
        
        self.userID = userID
        self.metricName = metricName
        self.dateUpdated = datetime_NY.strftime("%Y:%m:%d:%H:%M:%S")
        self.metricIndex = metricIndex
        self.runningCount = runningCount
        
        
        # Upload current constructor info to Firstore DB
        currMetricRef = db.collection(self.getUserID() 
                                      + "/Video Index: " 
                                      + str(self.getMetricIndex()) 
                                      + "/Script").document("Metric: " + self.getMetricName())
        
        currMetricRef.set({"userID" : self.getUserID(),
                                    "metricName" : self.getMetricName(),
                                    "dateUpdated" : self.getDateUpdated(),
                                    "metricIndex" : self.getMetricIndex(),
                                    "runningCount" : self.getRunningCount()})
     
    ### Getters and setters 4 Metadata
    def getUserID(self):
        return self.userID

    def getMetricName(self):
        return self.metricName

    def getDateUpdated(self):
        return self.dateUpdated
    
    def getMetricIndex(self):
        return self.metricIndex
  
    def getRunningCount(self):
        return self.runningCount
  


###Tester code for creating txt file
def main():
    
    testMetric = Metric(userID= "PAM", 
                        metricName= "Word Choice",
                        metricIndex= 0,
                        runningCount= 5)
    
    

    
main()