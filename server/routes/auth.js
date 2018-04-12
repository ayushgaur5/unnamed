var User = require('../models/user');
var response = require('../helpers/responseHelper');
var TokenHelper = require('../helpers/tokenHelper');

var auth = {
    /**
     * SignUp Request should atleast contain following fields :
     * firstName, lastName, emailAddress, mobileNumber, password
     */
    signup: function (req, res, next) {
        User.validateAndGenerateDocument(req.body)
            .then((doc) => User.create(req.app.locals.db, doc))
            .then((result) => response.success(res, 'SignUp Successful!'))
            .catch((err) => response.failed(res, 'SignUp Failed: ' + err));
    },

    signin: function (req, res, next) {
        User.signIn(req.app.locals.db, req.body)
            .then((token) => response.success(res, 'SignIn Successful', { token: token }))
            .catch((err) => response.failed(res, 'SignIn Failed: ' + err));
    },

    signout: function (req, res, next) {
        TokenHelper.expireToken(req.app.locals.db, req)
            .then(() => response.success(res, 'Signout Successful'))
            .catch((err) => response.failed(res, 'SignOut failed: ' + err));
    },

    forgot: function (req, res, next) {
        User.forgot(req.app.locals.db, req)
            .then(() => response.success(res, 'Reset password email sent'))
            .catch((reason) => response.failed(res, 'Forgot Password failed: ' + reason));
    },

    resetPassword: function (req, res, next) {
        User.resetPassword(req.app.locals.db, req)
            .then((result) => response.success(res, 'Password reset successfully', result))
            .catch((reason) => response.failed(res, 'Password reset failed: ' + reason));
    },

    validateToken: function (req, res, next) {
        TokenHelper.validateToken(req)
            .then((decoded) => response.success(res, 'Valid token'))
            .catch((reason) => response.failed(res, 'Invalid token: ' + reason));
    }
}

module.exports = auth;