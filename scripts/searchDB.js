var Quest = require('../models/quests.js').Quest;

Quest.search({query_string: {query: '*'}}, function (err, people) {
    console.log(people.hits.hits);
});
