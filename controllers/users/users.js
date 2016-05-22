'use strict';
var User = require('../../models/users');


class UsersController {
    constructor(usersProvider) {
        this.usersProvider = usersProvider;
    }

    getUser(req, res) {
        this.usersProvider.getUserById(req.params.userId, (err, doc) => {
            res.json({doc});
        });
    }

    editUser(req, res) {
        var newUserData = new User({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone
        });
        if (req.params.userId != req.user._id) {
            return res.sendStatus(403);
        }
        if (!newUserData.email || !newUserData.email) {
            return res.sendStatus(400);
        }
        this.usersProvider.editUserById(req.params.userId, newUserData, (err, updatedDoc) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!updatedDoc) {
                return res.sendStatus(400);
            }
            var user = req.user;
            user.email = newUserData.email;
            user.phone = newUserData.phone;
            user.username = newUserData.username;
            req.logIn(user, (err) => {
                if (!err) {
                    res.sendStatus(200);
                }
            });
        });

    }
}

exports.UsersController = UsersController;
