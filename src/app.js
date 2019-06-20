require('log-timestamp');
const express = require('express');
const bodyParser = require('body-parser');
const {
    connectToDB,
} = require('./db/mongoose');

const api = require('./routes/api/index');
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use('/api/v1', api);

connectToDB().then(async() => {

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    
    });
});
