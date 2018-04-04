var User = require('../models/user')
var response = require('../helpers/responseHelper');

var auth = {
    /**
     * SignUp Request should atleast contain following fields :
     * firstName, lastName, emailAddress, mobileNumber, password
     */
    signup: function (req, res, next) {
        User.validateAndGenerateDocument(req.body)
            .then((doc) => User.create(req.app.locals.db, doc))
            .then(() => response.success(res, 'SignUp Successful!'))
            .catch((err) => response.failed(res, 'SignUp Failed: ' + err));
    },

    signin: function (req, res, next) {
        User.signIn(req.app.locals.db, req.body)
            .then((user) => response.success(res, 'SignIn Successful', user.token))
            .catch((err) => response.failed(res, 'SignIn Failed: ' + err));
    },

    signout: function (req, res, next) {
        User.signOut(req.body)
            .then(() => response.success(res, 'Signout Successful'))
            .catch((err) => response.failed(res, 'SignOut failed: ' + err));
    }
}

module.exports = auth;