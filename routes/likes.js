var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var LikesController = require('../controllers/likes/likes').LikesController;
var DbLikesProvider = require('../controllers/likes/dbLikesProvider').DbLikesProvider;

var likesController = new LikesController(new DbLikesProvider());

router.post(
    '/quests/:questId/likes',
    loginRequired(),
    (req, res) => likesController.likeQuest(req, res));

router.delete(
    '/quests/:questId/likes',
    loginRequired(),
    (req, res) => likesController.dislikeQuest(req, res));

router.post(
    '/photos/:photoId/likes',
    loginRequired(),
    (req, res) => likesController.likePhoto(req, res));

router.delete('/photos/:photoId/likes',
    loginRequired(),
    (req, res) => likesController.dislikePhoto(req, res));

module.exports = router;
