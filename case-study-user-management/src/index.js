// importing all required module we need in this file
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

// create an express server application
const expressApp = express();

// register middleware
expressApp.use(bodyParser.json({ strict: false }));

// define some helper functions for cleaner code
const sendError = (res, statusCode, errorMessage) => {
    res.status(statusCode).json({ error: errorMessage });
};

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
            res.json({ secret: 'The meaning of life is 42!' });
        } else {
            sendError(res, 401, 'You shall not pass! Please login, first ;)');
        }
    });
});

// user defined middleware to validate body properties
const bodyRequired = (req, res, next) => {
    if (req.body === undefined || req.body === null) {
        return res.status(400).json({ error: 'Body is missing' });
    }

    next();
}

const createUserBodyValidation = (req, res, next) => {
    const { firstName, lastName } = req.body;

    if (firstName === undefined || firstName === null || typeof firstName !== 'string') {
        return sendError(res, 400, 'Body property <firstName> is missing or not of type string');
    }

    if (lastName === undefined || lastName === null || typeof lastName !== 'string') {
        return sendError(res, 400, 'Body property <lastName> is missing or not of type string');
    }

    next();
}

// register a POST route to enable creation of new users
expressApp.post('/users/', bodyRequired, createUserBodyValidation, (req, res) => {
    const { firstName, lastName } = req.body;

    database.createUser(firstName, lastName, (user) => {
        res.status(201).json({ user });
    });
});

// create a native Node.JS http server and let the server know,
// that express will handle all incoming http requests
const httpServer = http.createServer(expressApp);

// start the http server on port 3000
httpServer.listen(3000, () => {
    console.log('REST webservice is running and listening on port 3000');
});