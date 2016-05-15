var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var CommentsController = require('../controllers/comments/comments').CommentsController;
var DbCommentsProvider = require('../controllers/comments/dbCommentsProvider').DbCommentsProvider;

var commentsController = new CommentsController(new DbCommentsProvider());

router.get('/quests/:questId/comments', commentsController.list);
router.post('/quests/:questId/comments', loginRequired, commentsController.create);
router.put('/quests/:questId/comments', loginRequired, commentsController.edit);
router.delete('/quests/:questId/comments', loginRequired, commentsController.delete);

module.exports = router;
