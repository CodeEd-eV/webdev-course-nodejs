// importing all required module we need in this file
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// create an express server application
const expressApp = express();

// register middleware
expressApp.use(bodyParser.json({ strict: false }));

// serve our static assets for the chat website with express
// path.join builds our absolute file path to the public directory, which
// is located in the parent directory. Thus, we want <current_dir>/../public/
expressApp.use(express.static(path.join(__dirname, '../', 'public')))

// create a native Node.JS http server and let the server know,
// that express will handle all incoming http requests
const httpServer = http.createServer(expressApp);

// start the http server on port 3000
httpServer.listen(3000, () => {
    console.log('REST webservice is running and listening on port 3000');
});