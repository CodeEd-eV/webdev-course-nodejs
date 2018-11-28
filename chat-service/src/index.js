// importing all required module we need in this file
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { ChatService } = require('./chat-service');

// create an express server application
const expressApp = express();

// create chat service
const chatService = new ChatService();

// register middleware
expressApp.use(bodyParser.json({ strict: false }));

// serve our static assets for the chat website with express
// path.join builds our absolute file path to the public directory, which
// is located in the parent directory. Thus, we want <current_dir>/../public/
expressApp.use(express.static(path.join(__dirname, '../', 'public')));


// GET chats/
// GET chats/:chatName/messages
// POST chats/
// POST chats/:chatName/messages

expressApp.post('/users', (req, res) => {
    const userName = req.body.userName;

    if (typeof userName !== 'string' || userName.trim().length < 3) {
        return res.status(400).json({ error: 'The provided userName is not a valid string or is shorted than 3 characters' });
    }

    const user = chatService.createUser(userName);

    res.status(201).json(user);
});

expressApp.get('/chats', (req, res) => {
    const allChats = chatService.getChats();

    res.json(allChats);
});

expressApp.get('/chats/:chatName/messages', (req, res) => {
    const chatName = req.params.chatName;

    if (typeof chatName !== 'string') {
        return res.status(400).json({ error: 'URL param chatName is not a string' });
    }

    try {
        const chat = chatService.getChatByName(chatName);

        res.json(chat.messages);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

expressApp.post('/chats', (req, res) => {
    const chatName = req.body.chatName;
    const userID = req.body.userID;

    if (typeof chatName !== 'string' || chatName.trim().length < 3) {
        return res.status(400).json({ error: 'The provided chatName is not a valid string or is shorted than 3 characters' });
    }

    if (typeof userID !== 'number' || userID <= 0) {
        return res.status(400).json({ error: 'The provided userID is not a valid user id' });
    }

    let user = null;

    try {
        user = chatService.getUserByID(userID);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }

    try {
        const chat = chatService.createChat(chatName);
        chat.join(user);

        res.status(201).json(chat);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
});

expressApp.post('/chats/:chatName/messages', (req, res) => {
    const chatName = req.params.chatName;
    const userID = req.body.userID;
    const message = req.body.message;

    if (typeof chatName !== 'string' || chatName.trim().length < 3) {
        return res.status(400).json({ error: 'The provided chatName is not a valid string or is shorted than 3 characters' });
    }

    if (typeof userID !== 'number' || userID <= 0) {
        return res.status(400).json({ error: 'The provided userID is not a valid user id' });
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'The provided message is not a valid string or the message is empty' });
    }

    try {
        const chat = chatService.getChatByName(chatName);
        const user = chatService.getUserByID(userID);

        chat.sendMessage(user, message);

        res.status(201).json(chat.messages);
    } catch (err) {
        if (err.message.indexOf('is not allowed to send messages to chat') > -1) {
            res.status(403).json({ error: err.message });
        } else {
            res.status(404).json({ error: err.message });
        }
    }
});

expressApp.post('/chats/:chatName/users', (req, res) => {
    const chatName = req.params.chatName;
    const userID = req.body.userID;

    if (typeof chatName !== 'string' || chatName.trim().length < 3) {
        return res.status(400).json({ error: 'The provided chatName is not a valid string or is shorted than 3 characters' });
    }

    if (typeof userID !== 'number' || userID <= 0) {
        return res.status(400).json({ error: 'The provided userID is not a valid user id' });
    }

    try {
        const chat = chatService.getChatByName(chatName);
        const user = chatService.getUserByID(userID);

        chat.join(user);

        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// create a native Node.JS http server and let the server know,
// that express will handle all incoming http requests
const httpServer = http.createServer(expressApp);

// start the http server on port 3000
httpServer.listen(3000, () => {
    console.log('REST webservice is running and listening on port 3000');
});