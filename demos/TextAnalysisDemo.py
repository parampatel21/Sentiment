from nrclex import NRCLex

def analyze_text(text, output_file):
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
    
    # write the results to the output file
    with open(output_file, 'w') as f:
        # write the raw emotion scores
        f.write('Raw Emotion Scores:\n')
        for emotion, score in results['raw_emotion_scores'].items():
            f.write(f'{emotion}: {score}\n')
        
        # write the lowest emotion scores
        f.write('\nYour lowest emotion scores are as follows. \nConsider adjusting your performance to improve on these aspects:\n\n')
        for emotion, score in results['lowest_emotions'].items():
            f.write(f'{emotion}: {score}\n')
    
    with open(output_file, 'r') as f:    
        return f.read()



text = "love love love love hate hate hate"
print(analyze_text(text, "Text_Analysis_Demo.txt"))




