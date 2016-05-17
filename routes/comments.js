var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var CommentsController = require('../controllers/comments/comments').CommentsController;
var DbCommentsProvider = require('../controllers/comments/dbCommentsProvider').DbCommentsProvider;

var commentsController = new CommentsController(new DbCommentsProvider());

router.get(
    '/quests/:questId/comments',
    (req, res) => commentsController.list(req, res));

router.post(
    '/quests/:questId/comments',
    loginRequired,
    (req, res) => commentsController.create(req, res));

router.put(
    '/quests/:questId/comments',
    loginRequired,
    (req, res) => commentsController.edit(req, res));

router.delete(
    '/quests/:questId/comments',
    loginRequired,
    (req, res) => commentsController.delete(req, res));

module.exports = router;
