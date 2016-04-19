var express = require('express');
var router = express.Router();

var QuestModel = require('../models/quests.js').Quest;

router.get('/quests', function (req, res) {
    QuestModel.find({}, '_id name author description photo').populate('author')
        .exec(function (err, quests) {
            if (err) {
                console.log(err);
            } else {
                res.send(quests);
            }
        });
});

module.exports = router;
