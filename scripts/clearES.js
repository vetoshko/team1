// Clear ElasticSearch Models
var Quest = require('../models/quests.js').Quest;

module.exports = function (done) {
    Quest.esTruncate((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Cleared ES indexes');
        }
        done();
    });
};
