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

module.exports = {
    getUserByID
}