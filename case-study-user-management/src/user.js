class User {
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static fromDBResult(dbResult) {
        return new User(dbResult.user_id, dbResult.first_name, dbResult.last_name);
    }

    isLoggedIn() {
        return Math.random() > 0.5;
    }
}

module.exports.User = User;