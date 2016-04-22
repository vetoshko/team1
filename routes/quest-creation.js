var express = require('express');
var router = express.Router();
var uploadPhoto = require('../controllers/quest-creation.js');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var loginRequired = require('../middlewares/auth.js').loginRequired;

router.post('/', loginRequired, upload.array('photo', 15), uploadPhoto.post);

router.get('/', loginRequired, uploadPhoto.get);

module.exports = router;
