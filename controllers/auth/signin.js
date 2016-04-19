'use strict';

var passport = require('passport');

module.exports.post = function (req, res) {
    res.redirect('/');
};

module.exports.get = function (req, res) {
    res.render('signin/signin', { });
};
