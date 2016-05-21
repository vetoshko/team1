var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    var message = req.session.message;
    delete req.session.message;
    res.render('notification/notification', {message});
});

module.exports = router;
