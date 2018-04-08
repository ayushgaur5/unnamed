var validate = require('../helpers/validate');
var bcrypt = require('bcrypt');
var constants = require('../constants/');
var TokenHelper = require('../helpers/tokenHelper');

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
            reject('Invalid request, Please send emailAddress/mobileNumber and password to sign in.');
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
            reject('Something went wrong');
        }

        db.collection(constants.userCollection).findOne(filter, projection)
            .then((result) => {
                if (result && result.mobileNumber) {
                    var user = new User(result);
                    if (user.validatePassword(doc.password)) {
                        TokenHelper.generateToken(user.userDoc)
                            .then((token) => resolve(token))
                            .catch((reason) => reject(reason));
                    }
                    else reject('Invalid Password');
                }
                else { reject('User not found'); }
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
            password: User.getEncryptedPassword(validate.password(input.password, errors)),
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

User.getEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
// End: static functions

module.exports = User;