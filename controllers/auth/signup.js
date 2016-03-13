'use strict';

var passport = require('passport');
var User = require('../../models/users');

module.exports.get = function (req, res) {
    res.render('signup', { });
};

module.exports.post = function (req, res) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email}),
        req.body.password, function (err, user) {
            if (err) {
                return res.render('signup', { user });
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
};
