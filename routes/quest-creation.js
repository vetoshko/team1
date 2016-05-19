var express = require('express');
var router = express.Router();
var questCreation = require('../controllers/newQuest/quest-creation.js');
var photoUpload = require('../controllers/newQuest/photo-upload');
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var loginRequired = require('../middlewares/auth.js').loginRequired;

// Загрузка фотографий на cloudinary
router.post('/photos', loginRequired(true), upload.array('photo', 15), photoUpload.post);
// Создание самого квеста
router.post('/', loginRequired(true), upload.array(), questCreation.post);

router.get('/', loginRequired(true), questCreation.get);

module.exports = router;
