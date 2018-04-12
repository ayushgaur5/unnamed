var constants = require('../../constants');

var send = function(emailAddress, htmlBody, transporter) {
    var mailOptions = {
        from: `"${constants.appName}" <no-reply@${constants.emailService.host}>`,
        to: emailAddress,
        subject: constants.appName + ': Password Reset',
        html: htmlBody
    }

    return transporter.sendMail(mailOptions);
}

module.exports = {
    send: send
}