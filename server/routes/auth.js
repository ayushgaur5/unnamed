//var jwt = require('jwt-simple');
var User = require('../models/user')

var auth = {
  /**
   * SignUp Request should atleast contain following fields :
   * firstName, lastName, emailAddress, mobileNumber, password
   */
  signup: function (req, res, next) {
    var userDoc = User.validateAndGenerateDocument(req.body);

    if (userDoc.err) {
      let err = new Error('Signup details validation failed for ' + userDoc.err);
      err.status = 400;
      return next(err);
    }

    var userCreated = User.create(req.app.locals.db, userDoc);

    if (userCreated.err) {
      let err = new Error('Failed to add new user to database: ' + userCreated.err);
      err.status = 503;
      return next(err);
    }
    else {
      console.log('New user created');
      res.json({
        "status": "success",
        "message": "SignUp successful"
      })
    }
  },

  signin: function (req, res, next) {

  }
}

module.exports = auth;