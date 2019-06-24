require('elastic-apm-node').start({
    serverUrl: ' http://apm-server:8200'
  });
  
require('log-timestamp');
const promBundle = require("express-prom-bundle");
const express = require('express');
const bodyParser = require('body-parser');
const {
    connectToDB,
} = require('./db/mongoose');

const api = require('./routes/api/index');
const port = process.env.PORT || 3000;
const app = express();
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    normalizePath: [
        ['^/api/v1/project/.+/.+/commits', '/api/v1/project/#org/#repo/commits'],
    ]
});

app.use(metricsMiddleware);
app.use(bodyParser.json());

app.use('/api/v1', api);

connectToDB().then(async() => {

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    
    });
});
