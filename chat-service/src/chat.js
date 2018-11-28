class Chat {
    constructor(name) {
        this.name = name;
        this.participants = [];
        this.messages = [];
    }

    join(user) {
        const userAlreadyHasJoined = this.participants.some(alreadyJoinedUser => alreadyJoinedUser.id === user.id);

        if (!userAlreadyHasJoined) {
            this.participants.push(user);
        }
    }

    sendMessage(author, message) {
        const userAlreadyHasJoined = this.participants.some(alreadyJoinedUser => alreadyJoinedUser.id === author.id);

        if (!userAlreadyHasJoined) {
            throw new Error(`User <${author.id}> is not allowed to send messages to chat <${this.name}>`);
        }

        const now = new Date();
        const messageData = {
            author: author,
            date: now,
            message: message
        }

        this.messages.push(messageData);
    }
}

module.exports = {
    Chat
}