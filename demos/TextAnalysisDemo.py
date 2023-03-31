from nrclex import NRCLex

text = "I am having a terrible horrible no good very bad day"

doc = NRCLex(text)

# get the raw emotion scores
emotions = doc.raw_emotion_scores

# get the lowest three emotion values
lowest_emotions = sorted(emotions.items(), key=lambda x: x[1])[:3]

# write the raw emotion scores and the lowest three emotion values to a file
with open('nrctester.txt', 'w') as f:
    # write the raw emotion scores
    for emotion, score in emotions.items():
        f.write(f'{emotion}: {score}\n')
    # write the lowest three emotion values
    f.write('\nAreas of Possible Improvement:\n')
    for emotion, score in lowest_emotions:
        f.write(f'{emotion}: {score}\n')