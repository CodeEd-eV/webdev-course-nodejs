const { User } = require('./user');
const { Chat } = require('./chat');

class ChatService {
    constructor() {
        this.chats = [];
        this.users = [];
    }

    createChat(name) {
        const chatAlreadyExists = this.chats.some(chat => chat.name === name);

        if (chatAlreadyExists) {
            throw new Error(`The chat <${name}> already exists!`);
        }

        const chat = new Chat(name);
        this.chats.push(chat);

        return chat;
    }

    createUser(name) {
        const user = User.create(name);

        this.users.push(user);

        return user;
    }

    getUserByID(userID) {
        const user = this.users.find(user => user.id === userID);

        if (!user) {
            throw new Error(`User with id <${userID}> not found!`);
        }

        return user;
    }

    getChatByName(name) {
        const chat = this.chats.find(chat => chat.name === name);

        if (!chat) {
            throw new Error(`Chat <${name}> not found!`);
        }

        return chat;
    }

    getChats() {
        return this.chats;
    }
}

module.exports = {
    ChatService
}