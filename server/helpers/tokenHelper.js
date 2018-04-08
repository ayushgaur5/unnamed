var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var constants = require('../constants/')

var generateToken = function (user) {
    return new Promise(function (resolve, reject) {
        var guid = Date.now();
        var token = jwt.sign({ emailAddress: user.emailAddress, mobileNumber: user.mobileNumber }, secret,
            { expiresIn: constants.expiresDefault });

        if (token) {
            return resolve(token);
        }
        else {
            return reject('JWT generation failed.');
        }
    });
}

var validateToken = function (token) {
    // Note: This will also validate the expiration.
    return jwt.verify(token, secret);
}

var expireToken = function (db, req) {
    return new Promise(function (resolve, reject) {
        let token = getTokenFromRequest(req);

        if (!token) return reject('No token found in the request');

        db.collection(constants.expiredTokenCollection).insertOne({ token: token, created_at: Date.now() })
            .then((result) => resolve('Token successfully set as expired!'))
            .catch((reason) => reject(reason));
    });
}

var getTokenFromRequest = function (req) {
    return (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
}

var isTokenNotExpired = function (db, token) {
    return new Promise(function (resolve, reject) {
        db.collection(constants.expiredTokenCollection).findOne({ token: token })
            .then((result) => result ? reject('Token expired, sign in again') : resolve())
            .catch((reason) => reject(reason));
    });
}

var cleanUpExpiredTokenCollection = async function (db) {
    setTimeout(
        db.collection(constants.expiredTokenCollection).deleteMany({ created_at: { $lt: Date.now() - 7 * 24 * 60 * 60 * 1000 } }) // to add condition
            .then((result) => console.log('Cleaned Up stale data from Expired tokens collection'))
            .catch((reason) => console.log('cleanUpExpiredTokenCollection failed: ' + reason)),
        2000);
}

module.exports = {
    validateToken: validateToken,
    generateToken: generateToken,
    expireToken: expireToken,
    getTokenFromRequest: getTokenFromRequest,
    isTokenNotExpired: isTokenNotExpired,
    cleanUpExpiredTokenCollection: cleanUpExpiredTokenCollection,
}