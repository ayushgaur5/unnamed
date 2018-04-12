var User = require('../models/user');
var TokenHelper = require('../helpers/tokenHelper');
var response = require('../helpers/responseHelper');

var ValidateRequest = function (req, res, next) {
    return TokenHelper.validateToken(req)
        .then((decoded) => next())
        .catch((reason) => response.failed(res, reason));
}

module.exports = ValidateRequest;