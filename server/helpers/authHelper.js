var validate = require('./validate');
var bcrypt = require('bcrypt');

module.exports = {
    // Validate the signup fields in request
    validateSignUpFields: function (input) {
        var errors = [];
        if (!validate.emailAddress(input.emailAddress || input.email)) {
            errors.push('EmailAddress');
        }
        if (!validate.mobileNumber(input.mobileNumber || input.mobile || input.phoneNumber || input.phone)) {
            errors.push('MobileNumber');
        }
        if (!validate.password(input.password || input.pwd)) {
            errors.push('Password');
        }
        var doc = {
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            emailAddress: input.emailAddress.trim() || input.email.trim(),
            mobileNumber: input.mobileNumber || input.mobile || input.phoneNumber || input.phone,
            password: this.generateHash(input.password)
        };
        return { result: errors.length == 0, errors: errors, doc: doc };
    },

    // Generate hash of the password
    generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    // Validate the password
    validPassword: function (inputPassword, encryptedPassword) {
        return bcrypt.compareSync(password, encryptedpassword);
    }
}