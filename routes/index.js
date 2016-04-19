var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('main/main');
});

router.get('/quests', function (req, res) {
    res.render('quests/quests', { });
});

module.exports = router;
