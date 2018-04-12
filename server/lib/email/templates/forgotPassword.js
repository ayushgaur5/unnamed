var constants = require('../../../constants');

module.exports = function (user, resetUrl) {
    return `Dear ${user.firstName},<br/><br/>Please reset your password using the url below:<br/><br/><a href="${resetUrl}">ResetPassword</a><br/><br/><i>${constants.appName}</i>`;
}