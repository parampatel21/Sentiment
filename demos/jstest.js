function getTextAnalysis(uid, index) {
    const spawner = require('child_process').spawn;

    const dbtest_dict = {
        uid: uid,
        index: index,
        data_returned: undefined
    };

    console.log('Data sent to python script:', dbtest_dict);

    const python_process = spawner('python', ['./demos/TextAnalyzer.py', JSON.stringify(dbtest_dict)]);

    python_process.stdout.on('data', (data) => {
        console.log("Data received from python script:", JSON.parse(data.toString()));
});
}
//Put desired uid and index in method and it will return the full text analysis - some parsing might be necessary
getTextAnalysis('XrD8vDF13QQgv6HLEZz9brdo54N2', 1)