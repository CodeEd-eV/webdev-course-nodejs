class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static create(name) {
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        return new User(id, name);
    }
}

module.exports = {
    User
}