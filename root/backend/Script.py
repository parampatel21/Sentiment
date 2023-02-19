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
    
    def getScriptContent(self):
        return self.scriptContent
        
    ###TODO
    def sentimentAnalysis():
        print(5)
        text = "I had a good day"
        blob = tb(text)
        tags = blob.sentiment
        print(tags)
    
        
    
