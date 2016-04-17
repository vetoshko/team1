var express = require('express');
var router = express.Router();
var uploadPhoto = require('../controllers/upload-photo.js');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});

router.post('/', upload.array('photo', 15), uploadPhoto.post);

router.get('/', uploadPhoto.get);

module.exports = router;
