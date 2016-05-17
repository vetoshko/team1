'use strict';

var passport = require('passport');

module.exports.post = function (req, res) {
    passport.authenticate('local', (err, user) => {
        if (err || !user) {
            return res.redirect('/signin');
        }

        req.logIn(user, () => {
            var redirectAddr = req.session.beforeSigninAddress ||
                req.session.deniedAddress ||
                '/';
            delete req.session.beforeSigninAddress;
            delete req.session.deniedAddress;
            res.redirect(redirectAddr);
        });
    })(req, res);
};

module.exports.get = function (req, res) {
    req.session.beforeSigninAddress |= req.get('Referer');
    res.render('signin/signin', { });
};
