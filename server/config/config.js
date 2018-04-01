// Note: Make changes in config.example.js if want to be tracked in repo.

var config = {
    development: {
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db: 'appdb',
            user: 'appAdmin',
            pwd: 'c00k@pp'
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3000'
        }
    },
    production: {
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db: 'appdb',
            user: 'appAdmin',
            pwd: 'c00k@pp'
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3000'
        }
    }
};
module.exports = config;