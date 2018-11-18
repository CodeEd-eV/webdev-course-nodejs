// importing all required module we need in this file
const http = require('http');
const express = require('express');
const database = require('./database');

// create an express server application
const expressApp = express();

// register a GET route for getting user information
expressApp.get('/users/:userID', (req, res) => {
    const userID = req.params.userID;

    database.getUserByID(userID, (user) => {
        res.json(user);
    });
});

// register a GET route to access a top secret information
// which only can be accessed if the user is logged in
expressApp.get('/users/:userID/topsecret', (req, res) => {
    const userID = req.params.userID;

    database.getUserByID(userID, (user) => {
        if (user.isLoggedIn()) {
            res.send('The meaning of life is 42!').end();
        } else {
            res.status(403).send('You shall not pass! Please login, first ;)').end();
        }
    });
});

// create a native Node.JS http server and let the server know,
// that express will handle all incoming http requests
const httpServer = http.createServer(expressApp);

// start the http server on port 3000
httpServer.listen(3000, () => {
    console.log('REST webservice is running and listening on port 3000');
});