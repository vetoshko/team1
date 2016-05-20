var express = require('express');
var router = express.Router();
var loginRequired = require('../middlewares/auth.js').loginRequired;

var UsersController = require('../controllers/users/users').UsersController;
var DbUsersProvider = require('../controllers/users/dbUsersProvider').DbUsersProvider;

var usersController = new UsersController(new DbUsersProvider());

router.get('/:userId', loginRequired(), function (req, res) {
    usersController.getUser(req, res);
});


router.put('/:userId', loginRequired(), function (req, res) {
    usersController.editUser(req, res);
});


module.exports = router;
