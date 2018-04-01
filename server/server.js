var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var app = express();
var mongoUtil = require('./utils/mongoUtil');
const url = `mongodb://${config.database.user + ':' + encodeURIComponent(config.database.pwd)}@localhost:${config.database.port}/${config.database.db}`;

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
// app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  let err = new Error('PageNotFound');
  err.status = 404;
  next(err);
});

// Error handling middleware
app.use(require('./middlewares/errorHandler'));

process.on('unhandledRejection', function(reason, promise) {
  console.log(promise);
});

// Establish connection to MongoDB server
mongoUtil.connectToServer(url, function (err) {
  if (err) throw err;
  console.log("Connected successfully to MongoDB server");
  app.locals.db = mongoUtil.getDb().db(config.database.db);
  app.listen(config.server.port, function () {
    console.log('Express server listening on port ' + config.server.port);
  });
});