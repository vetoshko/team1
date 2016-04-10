var nodemailer = require('nodemailer');
var smtp = require('config').get('smtp');

function sendMail(mailOptions, done) {
    var transporter = nodemailer.createTransport(smtp);
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return done(err);
        }
        done();
    });
}

module.exports.sendVerificationMail = function (message, done) {
    var mailOptions = {
        from: 'noreply',
        to: message.email,
        subject: 'Добро пожаловать!',
        html: 'Уважаемый ' + message.name + '! Добро пожаловать на наш сервис. Для завершения ' +
        'регистрации пройдите по указанной ссылке: <a target="_blank" href="' + message.verifyURL +
        '">ТЫК!</a>'
    };
    sendMail(mailOptions, done);
};

module.exports.sendPasswordResetMail = function (message, done) {
    var mailOptions = {
        from: 'noreply',
        to: message.email,
        subject: 'Восстановление пароля',
        html: 'Вы получили это сообщение, потому что Вы (или кто-то другой)' +
        ' запросили восстановление пароля.\n\n Чтобы восстановить пароль, ' +
        'кликните по ссылке или скопируйте' +
        'ссылку в адресную стоку браузера:\n\n <a target="_blank" href="' + message.resetURL +
        '">ТЫК!</a>\n\n' +
        'Если вы не запрашивали восстановление пароля, то проигнорируйте это сообщение.\n'
    };
    sendMail(mailOptions, done);
};

module.exports.sendPasswordResetConfirmationMail = function (message, done) {
    var mailOptions = {
        from: 'noreply',
        to: message.email,
        subject: 'Ваш пароль был успешно изменен',
        html: 'Ваш пароль был успешно изменен.\n'
    };
    sendMail(mailOptions, done);
};
