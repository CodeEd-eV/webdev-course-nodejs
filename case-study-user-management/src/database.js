const faker = require('faker');
const { User } = require('./user');

const fakeUserDBResult = (userID) => {
    const dbResult = {
        user_id: userID,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName()
    }

    return dbResult;
};

const getUserByID = (userID, callback) => {
    const dbResult = fakeUserDBResult(userID);

    // fake async behaviour
    setTimeout(() => {
        const user = User.fromDBResult(dbResult);

        callback(user);
    }, 1000);
};

const createUser = (firstName, lastName, callback) => {
    const userID = Math.floor(Math.random() * 1000) + 1;

    // fake async behaviour
    setTimeout(() => {
        const user = new User(userID, firstName, lastName);

        callback(user);
    }, 1000);
};

module.exports = {
    getUserByID,
    createUser
}