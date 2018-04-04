var generate = function (user, guid, opts) {
    opts = opts || {};
    var expiresDefault = '7d';

    var token = jwt.sign({
        auth: guid,
        user: user
    }, secret, { expiresIn: opts.expires || expiresDefault });

    return token;
}

var validate = function (token) {
    return new Promise(function (resolve, reject) {
        try {
            var decoded = jwt.verify(token, require('../config/secret'));
        } catch (e) {
            return reject(e.toString());
        }
        if (!decoded || decoded.mobileNumber !== mobileNumber) {
            return reject('Token Invalid');
        } else {
            return resolve(token);
        }
    });
}

var generateAndStore = function (db, user) {
    var guid = generateGUID();
    var token = generate(user, guid, opts);
    var record = {
        "valid": true,
        "created": new Date().getTime()
    };

    var db = req.app.locals.db;
    db.collections('tokens').insert({guid: record})
        .then()
        .catch();

    return token;
}

// generate a GUID
var generateGUID = function () {
    return new Date().getTime();
}

module.exports = {
    generate: generate,
    validate: validate,
    generateAndStore: generateAndStore
}