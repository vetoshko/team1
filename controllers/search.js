var mongoose = require('../scripts/mongooseConnect.js');
var Quest = require('../models/quests.js').Quest;

module.exports.post = (req, res) => {
    var searchString = req.body.search;
    var searchResults = Quest.search({query_string: {query: searchString}}, (err, result) => {
        if (!err) {
            res.render('search/search', {
                searchHits: result.hits.hits,
                total: result.hits.total
            });
        } else {
            res.send('Скорей всего ты на guest wifi в Яндексе и все порты закрыты');
        }
    });
};
