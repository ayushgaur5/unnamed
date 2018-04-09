var send = function(user, options, transporter) {
    var mailOptions = {
        from: `"Cook App" <no-reply@${constants.emailHost}>`,
        to: user.emailAddress,
        subject: 'Password Reset',
        html: require(options.template)(user, options.url)
    }

    return transporter.sendMail(mailOptions);
}

module.exports = {
    send: send
}