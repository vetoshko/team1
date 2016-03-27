'use strict';

var passport = require('passport');
var User = require('../../models/users');
var cryptojs = require('crypto-js');
var mailSender = require('../../scripts/sendMail.js');
var secretKey = require('config').get('secretKey');

module.exports.get = function (req, res) {
    res.render('signup', { });
};

module.exports.post = function (req, res) {
    User.register(new User({
            username: req.body.username,
            email: req.body.email
        }),
        req.body.password, function (err, user) {
            if (err) {
                return res.redirect('signup');
            }
            var token = cryptojs.AES.encrypt(req.body.email, secretKey);
            var message = {
                email: req.body.email,
                name: req.body.username,
                verifyURL: 'http://' + req.get('host') + '/verify/' + token
            };
            mailSender.sendVerificationMail(message, function (err) {
                res.redirect('/');
            });
        });
};
