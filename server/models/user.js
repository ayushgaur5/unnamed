var validate = require('../helpers/validate');
var bcrypt = require('bcrypt');

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
     "email": "ayush@gmail.com",
     "mobile": "8726121321",
     "password": "Password"
 }
 */

function User(db, doc) {
    var query;
    if (!validate.isEmptyOrNull(doc.mobileNumber || doc.mobile)) {
        query = { mobileNumber: doc.mobileNumber.trim() || doc.mobile.trim() };
    }
    if (!validate.isEmptyOrNull(doc.emailAddress || doc.email)) {
        query = { emailAddress: doc.emailAddress.trim() || doc.email.trim() };
    }
    try {
        db.collection('users').findOne(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    }
    catch (err) {
        next(err);
    }
}

// Start: Object Properties and methods
User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(this.doc.encryptedpassword);
}
// End: Object Properties and methods

// Start: Static functions
User.create = function (db, userDoc) {
    var result;

    db.collection('users').insertOne(userDoc).then(function (result) {
        console.log("Insert successful: " + result);
        result = { success: true };
    }).catch(function (reason) {
        result = { err: 'DB_INS_ERR: ' + reason };
    });

    return result;
}

User.validateAndGenerateDocument = function (input) {
    var errors = [];

    var doc = {
        firstName: validate.firstName(input.firstName, errors),
        lastName: validate.lastName(input.lastName, errors),
        emailAddress: validate.lastName(input.emailAddress || input.email, errors),
        mobileNumber: validate.mobileNumber(input.mobileNumber || input.mobile, errors),
        password: User.getEncryptedPassword(validate.password(input.password || input.pwd, errors))
    };

    if (errors.length > 0) {
        return { err: errors.toString() };
    }
    else {
        return doc;
    }
}

User.getEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
// End: static functions

module.exports = User;