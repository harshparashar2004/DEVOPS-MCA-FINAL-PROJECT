const express = require('express');
const app = express();

app.use(express.json());

app.post('/test', (req, res) => {
    console.log('POST /test received');
    res.json({ message: 'POST works' });
});

app.listen(3001, () => {
    console.log('Test server on port 3001');
});