var validate = require('../helpers/validate');
var bcrypt = require('bcrypt');
var constants = require('../constants/');
var TokenHelper = require('../helpers/tokenHelper');
var Email = require('../lib/email');

/**
 * User Document fields:
 * firstName,
 * lastName,
 * emailAddress,
 * mobileNumber,
 * password,
 * 
 * <<UPDATE if adding new field>>
 SAMPLE :
 {
	 "firstName": "ayush",
	 "emailAddress": "ayush@gmail.com",
	 "mobileNumber": "8726121321",
	 "password": "Password"
 }
 */

function User(userDoc) {
    this.userDoc = userDoc;
}

User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.userDoc.password);
}

// Start: Static functions
User.signIn = (db, doc) => {
    return new Promise(function (resolve, reject) {
        if (!doc.password || (!doc.emailAddress && !doc.mobileNumber)) {
            return reject('Invalid request, Please send emailAddress/mobileNumber and password to sign in.');
        }

        var filer;
        var projection = { projection: { _id: 0 } };

        if (doc.emailAddress) {
            filter = { emailAddress: doc.emailAddress };
        }
        else if (doc.mobileNumber) {
            filter = { mobileNumber: doc.mobileNumber };
        }
        else {
            return reject('Something went wrong');
        }

        db.collection(constants.userCollection).findOne(filter, projection)
            .then((result) => {
                if (result && result.mobileNumber) {
                    var user = new User(result);
                    if (user.validatePassword(doc.password)) {
                        TokenHelper.generateToken(user.userDoc)
                            .then((token) => resolve(token));
                    }
                    else reject('Invalid Password');
                }
                else reject('User not found');
            })
            .catch((reason) => reject(reason));
    });
}

User.create = function (db, userDoc) {
    return new Promise(function (resolve, reject) {
        db.collection(constants.userCollection).insertOne(userDoc)
            .then((result) => resolve(result))
            .catch((reason) => reject(reason));
    });
}

User.validateAndGenerateDocument = function (input) {
    return new Promise(function (resolve, reject) {
        var errors = [];

        var doc = {
            firstName: validate.firstName(input.firstName, errors),
            lastName: validate.lastName(input.lastName, errors),
            emailAddress: validate.emailAddress(input.emailAddress, errors),
            mobileNumber: validate.mobileNumber(input.mobileNumber, errors),
            password: getEncryptedPassword(validate.password(input.password, errors)),
            created_at: Date.now(),
            updated_at: Date.now()
        };

        if (errors.length > 0) {
            reject('Validation failed for: ' + errors.toString());
        }
        else {
            resolve(doc);
        }
    });
}

User.forgot = function (db, req) {
    return new Promise(function (resolve, reject) {
        if (!req.body || !req.body.emailAddress) {
            return reject('Email Address not found in the request');
        }

        var userDoc = {};
        db.collection(constants.userCollection).findOne({ emailAddress: req.body.emailAddress })
            .then((result) => {
                if (!result) reject('Email Address not found');
                userDoc = result;
                return TokenHelper.generateToken(result, '1d');
            })
            .then((token) => {
                var url = 'http://' + req.headers.host + '/forgotPassword?token=' + token;
                return Email.send(userDoc.emailAddress,
                    require('../lib/email/templates/forgotPassword')(userDoc, url),
                    req.app.locals.transporter);
            })
            .then((result) => resolve("Password reset email sent successfully."))
            .catch((reason) => reject(reason));
    });
}

User.resetPassword = function (db, req) {
    return new Promise(function (resolve, reject) {
        var token = TokenHelper.getTokenFromRequest(req);
        var errors = [];
        validate.password(req.body.newPassword, errors);

        if (!token || !req.body || !req.body.newPassword || errors.length > 0) {
            return reject('Invalid/Missing Token or New Password or both in the request');
        }

        TokenHelper.validateToken(req)
            .then((decoded) => changePassword(db, decoded.mobileNumber, req.body.newPassword))
            .then((result) => TokenHelper.expireToken(db, req))
            .then((result) => resolve(result))
            .catch((reason) => reject(reason));
    })
}
// End: static functions

var changePassword = function (db, mobileNumber, newPassword) {
    return db.collection('users').updateOne(
        { mobileNumber: mobileNumber },
        { $set: { password: getEncryptedPassword(newPassword) } });
}

var getEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

module.exports = User;