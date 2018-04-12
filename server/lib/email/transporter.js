var nodemailer = require('nodemailer');
var constants = require('../../constants');

const transporter = nodemailer.createTransport({
    host: constants.emailService.host,
    port: 587,
    auth: {
        user: constants.emailService.user,
        pass: constants.emailService.pass
    }
});

module.exports = transporter;
