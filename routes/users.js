var express = require('express');
var router = express.Router();
var geolib = require('geolib');
var Quest = require('../models/quests').Quest;
var loginRequired = require('../middlewares/auth.js').loginRequired;

var UsersController = require('../controllers/users/users').UsersController;
var DbUsersProvider = require('../controllers/users/dbUsersProvider').DbUsersProvider;

var usersController = new UsersController(new DbUsersProvider());

var Statuses = require('../scripts/QuestUserStatus');
var changeStatus = require('../scripts/ChangeQuestStatus');

router.post('/checkin', (req, res) => {
    console.log(req.body);
    var userPosition = {latitude: req.body.geo.lat, longitude: req.body.geo.lon};
    var compResult = null;
    Quest.findById(
        req.body.questId,
        (err, data) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(data);
                for (var i in data.photo) {
                    // console.log(data.photo[i]._id);
                    if (data.photo[i]._id == req.body.authorPhotoId) {
                        var authorPhoto = data.photo[i].location;
                        authorPhoto = {latitude: authorPhoto.lat, longitude: authorPhoto.lon};
                        //console.log(authorPhoto);
                        compResult = geolib.getDistance(
                            userPosition,
                            authorPhoto
                        );
                        //console.log(compResult);
                        if (compResult <= 200) {
                            data.photo[i].checkIn.push(req.user);
                            data.save((err, doc) => {
                                console.log(err, doc);
                            });
                        }

                    }
                }
                if (compResult <= 200) {
                    res.json({comparisonResult: true});
                } else {
                    res.json({comparisonResult: false});
                }
            }
        });
});

router.get('/getCurrentUser', loginRequired(), function (req, res) {
    req.user
        .populate('startedQuests')
        .populate('ownedQuests', (err, user) => {
            res.json({user: req.user, userRole: req.userRole});
        });
});

router.get('/getCurrentState', (req, res) => {
    var resultObject = {};
    if (!req.user) {
        res.json({
            photos: null,
            questStatus: 'none',
            userRole: req.userRole
        });
    } else {
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
    }

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

router.get('/profile', loginRequired(true), (req, res) => {
    res.redirect(`/users/${req.user._id}/profile`);
});

router.get('/:userId/profile', (req, res) => {
    res.render('user/user', {userId: req.params.userId.toString()});
});


router.get('/:userId', function (req, res) {
    usersController.getUser(req, res);
});


router.put('/:userId', loginRequired(), function (req, res) {
    usersController.editUser(req, res);
});

module.exports = router;
