var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var questControllers = require('../controllers/quests.js');

router.get('/', questControllers.getListPage);
router.get('/questsList', questControllers.list);
router.get('/:questId', questControllers.get);
router.get('/:questId/info', questControllers.getInfo);
router.post('/:questId', loginRequired(), questControllers.edit);
router.delete('/:questId', loginRequired(), questControllers.delete);
router.put('/:questId', loginRequired(), questControllers.addPhoto);
router.delete('/:questId/:photoId', loginRequired(), questControllers.deletePhoto);

module.exports = router;
