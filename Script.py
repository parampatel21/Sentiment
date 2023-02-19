#Performance script class
import nltk
nltk.download("text2emotion")
import text2emotion as te



class Script:
    def __init__(self,userID,title,dateCreated):
        #ID metadata
        self.userID = userID
        self.title = title
        self.dateCreated = dateCreated
        
        #Emotional analysis report (For video-script comparisson)
        self.emotionalReport = None
        
        #Other report
        self.wordChoiceReport = None
        self.sentenceChoiceReport = None
        
        #Combined report
        self.combinedReport = None
        self.personalNotes = None
        
        
    
    def getUserID(self):
        return self.userID

    def getTitle(self):
        return self.title
    
    def setTitle(self, title):
        self.title = title

    def getDateCreated(self):
        return self.dateCreated

    def setPersonalNotes(self, personalNotes):
        self.personalNotes = personalNotes
        
    
