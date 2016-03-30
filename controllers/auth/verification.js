var cryptojs = require('crypto-js');
var passport = require('passport');
var mongoose = require('../../scripts/mongooseConnect.js');
var secretKey = require('config').get('secretKey');
var User = require('../../models/users');

module.exports = function (req, res) {
    console.log(req.params.token);
    var decrypted = cryptojs.AES.decrypt(req.params[0], secretKey);
    var email = decrypted.toString(cryptojs.enc.Utf8);
    console.log(email);
    User.findOne({email}, function (err, user) {
        if (err || !user) {
            return res.redirect('/');
        }
        user.createdAt = undefined;
        user.save(function (err) {
            if (err) {
                return res.redirect('/');
            }
            req.login(user, function (err, done) {
                if (err) {
                    return done(err);
                }
                return res.redirect('/');
            });
        });
    });
};
