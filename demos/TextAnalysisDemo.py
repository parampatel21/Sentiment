from nrclex import NRCLex

def analyze_text(text):
    doc = NRCLex(text)
    emotions = doc.raw_emotion_scores
    
    # create a dictionary to store the results
    results = {}
    results['raw_emotion_scores'] = emotions
    
    # get the lowest 3 values from my_dict1 and any ties that exceed the lowest 3
    lowest_values = [item for item in sorted(results['raw_emotion_scores'].items(), key=lambda x: x[1])[:3]]
    ties = set([item for item in sorted(results['raw_emotion_scores'].items(), key=lambda x: x[1])[3:] if item[1] == lowest_values[-1][1]])

    # add any ties to the lowest 3 values and convert the result to a dictionary for my_dict1
    result = {item[0]: item[1] for item in lowest_values} 
    result.update({item[0]: item[1] for item in sorted(ties)})
    

    results['lowest_emotions'] = result
    
    return results

text = "love love love love hate hate hate"
results = analyze_text(text)

print("\n")
print(results['raw_emotion_scores'])
print(results['lowest_emotions'])

