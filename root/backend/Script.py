#Performance script class

#Sentiment analysis lib
from textblob import TextBlob as tb


class Script:
    def __init__(self,userID,title,dateCreated,scriptContent):
        #ID metadata
        self.userID = userID
        self.title = title
        self.dateCreated = dateCreated
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

    def setPersonalNotes(self, personalNotes):
        self.personalNotes = personalNotes
        return True
    
    def setScriptContent(self, scriptContent):
        self.scriptContent = scriptContent
        return True
   
   
        """Create formatted text file & download to user's download folder
        """
    def downloadScript(self):
       with open("~/Desktop/Script.txt", "w") as text_file:
        text_file.write("User ID: %s\n" % self.getUserID())
        text_file.write("Date Created: %s\n" %self.getDateCreated())
        text_file.write("Current Script: %s\n" % self.getScriptContent())
        
        
    def getScriptContent(self):
        return self.scriptContent
        
    ###TODO
    def sentimentAnalysis():
        print(5)
        text = "I had a good day"
        blob = tb(text)
        tags = blob.tags
        print(tags)

    
###Tester code for creating txt file
def main():
    testScript = Script(userID= "ChrisL", 
           title= "New Script",
           dateCreated= "02/19/2023",
           scriptContent= "This is a text script. Hello!")
    
    testScript.downloadScript()
    
main()
    
