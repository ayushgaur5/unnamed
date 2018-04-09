var nodemailer = require('nodemailer');
var constants = require('../../constants');

let poolConfig = {
    pool: true,
    host: constants.emailHost,
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'no-reply',
        pass: 'password'
    }
};

let transporter = nodemailer.createTransport(poolConfig);

module.exports = transporter;
