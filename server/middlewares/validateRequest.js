var User = require('../models/user');
var TokenHelper = require('../helpers/tokenHelper');
var response = require('../helpers/responseHelper');

var ValidateRequest = function (req, res, next) {
    var token = TokenHelper.getTokenFromRequest(req);
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token) {
        try {
            var decoded = TokenHelper.validateToken(token);

            TokenHelper.isTokenNotExpired(req.app.locals.db, token)
                .then(() => next())
                .catch((reason) => response.failed(res, reason));
        }
        catch (err) {
            response.failed(res, err);
        }
    }
    else {
        response.failed(res, 'Unauthorized Access!');
    }
};

module.exports = ValidateRequest;