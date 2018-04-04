var validate = require('../helpers/validate');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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

// Start: Object Properties and methods
User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(this.doc.encryptedpassword);
}
// End: Object Properties and methods

// Start: Static functions
User.signIn = (db, doc) => {
    return new Promise(function (resolve, reject) {
        if (!doc.password || (!doc.emailAddress && !doc.mobileNumber)) {
            reject('Invalid request, Please send emailAddress/mobileNumber and password to sign in.');
        }

        var filer;
        var projection = { projection: { _id: 0, password: 0 } };

        if (doc.emailAddress) {
            filter = { emailAddress: doc.emailAddress };
        }
        else if (doc.mobileNumber) {
            filter = { mobileNumber: doc.mobileNumber };
        }
        else {
            reject('Something went wrong');
        }

        db.collection('users').findOne(filter, projection)
            .then((result) => {
                if (result && result.mobileNumber) {
                    resolve(new User(result));
                }
                else { reject('Invalid Credentials'); }
            })
            .catch((reason) => reject(reason));
    });
}

User.signOut = function (input) {
    if (!input.mobileNumber) {
        reject('Invalid request, Please send mobileNumber to sign out.');
    }
}

User.create = function (db, userDoc) {
    return new Promise(function (resolve, reject) {
        db.collection('users').insertOne(userDoc)
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
            password: User.getEncryptedPassword(validate.password(input.password, errors))
        };

        if (errors.length > 0) {
            reject('Validation failed for: ' + errors.toString());
        }
        else {
            resolve(doc);
        }
    });
}

User.getEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
// End: static functions

module.exports = User;