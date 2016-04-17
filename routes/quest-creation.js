var express = require('express');
var router = express.Router();
var questCreation = require('../controllers/quest-creation.js');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var loginRequired = require('../middlewares/auth.js').loginRequired;

router.post('/', loginRequired, upload.array('photo', 15), questCreation.post);

router.get('/', loginRequired, questCreation.get);

module.exports = router;
