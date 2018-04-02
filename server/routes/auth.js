var jwt = require('jwt-simple');
var validate = require('../helpers/validate');
var authHelper = require('../helpers/authHelper');

var auth = {
  // SignUp Request should atleast contain following fields :
  // firstName, lastName, emailAddress, mobileNumber, password
  signup: function (req, res, next) {
    var validation = authHelper.validateSignUpFields(req.body);

    if (!validation.result) {
      let err = new Error('Validation failed for ' + validation.errors.toString());
      err.status = 400;
      next(err);
    }

    try {
      const db = req.app.locals.db;
      db.collection('users').insert(validation.doc);
      console.log('New user created');
    }
    catch (err) {
      console.log('Failed to add new user to database');
      next(err);
    }
  }
}

/*signin: function(req, res, next) {
 
  var username = req.body.username || '';
  var password = req.body.password || '';
 
  if (username == '' || password == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
 
  // Fire a query to your DB and check if the credentials are valid
  var dbUserObj = auth.validate(username, password);
 
  if (!dbUserObj) { // If authentication fails, we send a 401 back
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
 
  if (dbUserObj) {
 
    // If authentication is success, we will generate a token
    // and dispatch it to the client
 
    res.json(genToken(dbUserObj));
  }
 
},
 
validate: function(username, password) {
  // spoofing the DB response for simplicity
  var dbUserObj = { // spoofing a userobject from the DB. 
    name: 'arvind',
    role: 'admin',
    username: 'arvind@myapp.com'
  };
 
  return dbUserObj;
},
 
validateUser: function(username) {
  // spoofing the DB response for simplicity
  var dbUserObj = { // spoofing a userobject from the DB. 
    name: 'arvind',
    role: 'admin',
    username: 'arvind@myapp.com'
  };
 
  return dbUserObj;
},
}
 
// private method
function genToken(user) {
var expires = expiresIn(7); // 7 days
var token = jwt.encode({
  exp: expires
}, require('../config/secret')());
 
return {
  token: token,
  expires: expires,
  user: user
};
}
 
function expiresIn(numDays) {
var dateObj = new Date();
return dateObj.setDate(dateObj.getDate() + numDays);
}
*/
module.exports = auth;