var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var constants = require('../constants/');

function initDb(client) {
    return new Promise(function (resolve, reject) {
        var db = client.db(config.database.db);
        db.collection(constants.userCollection).ensureIndex({ emailAddress: 1 }, { unique: true })
            .then((res) => db.collection(constants.userCollection).ensureIndex({ mobileNumber: 1 }, { unique: true }))
            .then((res) => db.collection(constants.expiredTokenCollection).ensureIndex({ token: 1 }, { unique: true }))
            .then((res) => resolve(db))
            .catch((reason) => reject(reason));
    });
}

module.exports = { initDb: initDb };