var User = require('../../models/users');
var cryptojs = require('crypto-js');
var mailSender = require('../../scripts/sendMail.js');
var secretKey = require('config').get('secretKey');

module.exports.get = function (req, res) {
    res.render('reset', { });
};

module.exports.post = function (req, res) {
    var token = cryptojs.AES.encrypt(req.body.email + Date.now().toString(), secretKey);
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            req.flash('Error', 'На данный почтовый адрес не зарегистрировано пользователей.');
            return res.redirect('/reset');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        user.save(function (err) {
            if (err) {
                req.flash('Error', 'Ошибка сохранения. Попробуйте ещё раз.');
                return res.redirect('/reset');
            }
            var message = {
                email: req.body.email,
                resetURL: 'http://' + req.get('host') + '/reset/' + token
            };
            mailSender.sendPasswordResetMail(message, function (err) {
                if (err) {
                    req.flash('Error', 'Не удалось отправить письмо.');
                }
            });
            res.redirect('/');
        });
    });
};

module.exports.getreset = function (req, res) {
    User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        },
        function (err, user) {
            if (!user || err) {
                req.flash('Error', 'Неправильная или просроченная ссылка.');
                return res.redirect('/reset');
            }
            res.render('reset', {
                user: req.user
            });
        });
};

module.exports.postreset = function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }, function (err, user) {
        if (!user || err) {
            req.flash('Error', 'Неправильная или просроченная ссылка.');
            return res.redirect('/reset');
        }
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.setPassword(req.body.password, function () {
            user.save(function (err) {
                if (err) {
                    req.flash('Error', 'Ошибка сохранения. Попробуйте ещё раз.');
                    return res.redirect('/reset');
                }
                req.login(user, function (err) {
                });
                var message = {
                    email: req.body.email
                };
                mailSender.sendPasswordResetConfirmationMail(message, function (err) {
                    if (err) {
                        req.flash('Error', 'Не удалось отправить письмо.');
                    }
                });
                res.redirect('/');
            });
        });
    });
};
