var express = require('express');
var router = express.Router();

var QuestModel = require('../models/quests.js').Quest;

router.get('/', function (req, res) {
    QuestModel.find({})
        .populate('author', 'username')
        .exec(function (err, quests) {
            if (err) {
                console.log(err);
            } else {
                res.json({quests});
            }
        });
});

module.exports = router;
