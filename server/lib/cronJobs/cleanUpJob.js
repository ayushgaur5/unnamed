function cleanUpJob (db) {
    this.db = db;
}

var CronJob = require('cron').CronJob;
var TokenHelper = require('../../helpers/tokenHelper');
var job = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: function () {
        TokenHelper.cleanUpExpiredTokenCollection(this.db);
    },
    start: false,
    timeZone: 'Asia/Colombo'
});

cleanUpJob.prototype.start = function() {
    job.start();
}

module.exports = cleanUpJob;