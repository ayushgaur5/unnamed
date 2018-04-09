module.exports = function (user, reseturl) {
    return `Dear ${user.firstName},<br/><br/>Please reset your password using the url below:<br/><br/>${resetUrl}<br/><br/>Cook App LOL`;
}