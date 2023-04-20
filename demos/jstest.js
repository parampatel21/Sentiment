const spawner = require('child_process').spawn;

const data_to_pass_in = {
    data_sent: 'Send this to python script.',
    data_returned: undefined
};

const dbtest_dict = {
    uid: 'XrD8vDF13QQgv6HLEZz9brdo54N2',
    index: 1,
    data_returned: undefined
};

console.log('Data sent to python script:', dbtest_dict);

const python_process = spawner('python', ['./demos/analyzer.py', JSON.stringify(dbtest_dict)]);

python_process.stdout.on('data', (data) => {
    console.log("Data received from python script:", JSON.parse(data.toString()));
});