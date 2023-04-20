const spawner = require('child_process').spawn;

const data_to_pass_in = {
    data_sent: 'Send this to python script.',
    data_returned: undefined
};

console.log('Data sent to python script:', data_to_pass_in);

const python_process = spawner('python', ['./demos/pytest.py', JSON.stringify(data_to_pass_in)]);

python_process.stdout.on('data', (data) => {
    console.log("Data received from python script:", JSON.parse(data.toString()));
});