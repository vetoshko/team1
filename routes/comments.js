var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var commentsControllers = require('../controllers/comments/comments.js');

router.get('/quests/:questId/comments', commentsControllers.list);
router.post('/quests/:questId/comments', loginRequired, commentsControllers.create);
router.put('/quests/:questId/comments', loginRequired, commentsControllers.edit);
router.delete('/quests/:questId/comments', loginRequired, commentsControllers.delete);

module.exports = router;
