var MongoClient = require('mongodb').MongoClient;
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

var _db;

module.exports = {

    connectToServer: function (url, callback) {
        console.log('Connecting to mongodb server');
        MongoClient.connect(url, function (err, db) {
            _db = db;
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};