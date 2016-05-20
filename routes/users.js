var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var UsersController = require('../controllers/users/users').UsersController;
var DbUsersProvider = require('../controllers/users/dbUsersProvider').DbUsersProvider;

var usersController = new UsersController(new DbUsersProvider());

router.get('/getCurrentUser', loginRequired(), function (req, res) {
    console.log(req.user);
    res.json({user: req.user, userRole: req.userRole});

var Statuses = require('../scripts/QuestUserStatus');
var changeStatus = require('../scripts/ChangeQuestStatus');

router.get('/getCurrentState', (req, res) => {
    var resultObject = {};
    Statuses.isPhotosChecked(req.user._id, req.query.questId).then(
        result => {
            resultObject.photos = result;
            Statuses.getUserRole(req.user, req.query.questId).then(
                result => {
                    resultObject.questStatus = result;
                    resultObject.userRole = req.userRole;
                    res.json(resultObject);
                },
                err => {
                    console.log(err);
                });
        },
        err => {
            console.log(err);
        });
});

router.post('/startQuest', (req, res) => {
    changeStatus.startQuest(req.user._id, req.body.questId, (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/:userId', loginRequired(), function (req, res) {
    usersController.getUser(req, res);
});


router.put('/:userId', loginRequired(), function (req, res) {
    usersController.editUser(req, res);
});

module.exports = router;
