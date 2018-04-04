var response = require('../helpers/responseHelper');

function errorHandler(err, req, res, next) {
    response.failed(res, err.message, err.statusCode || err.status);
}

module.exports = errorHandler;