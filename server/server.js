const express = require('express');
const textAnalyzer = require('./textAnalyzer.py');

const app = express();

app.use(express.json());

app.post('/api/text-analysis', async (req, res) => {
    const result = await textAnalyzer.analyze(req.body.text);
    res.json(result);
});

app.listen(3000, () => {
    console.log('Server is listening on port 3001');
});
