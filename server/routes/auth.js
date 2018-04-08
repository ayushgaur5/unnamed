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
    }
}

module.exports = auth;