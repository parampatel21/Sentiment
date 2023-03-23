import nltk
from nrclex import NRCLex

text = "COVID-19 is very dangerous"

emotion = NRCLex(text)

print(emotion.top_emotions)