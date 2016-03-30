var nodemailer = require('nodemailer');
var smtp = require('config').get('smtp');

module.exports.sendVerificationMail = function (message, done) {
    var mailOptions = {
        from: 'noreply',
        to: message.email,
        subject: 'Добро пожаловать!',
        html: 'Уважаемый ' + message.name + '! Добро пожаловать на наш сервис. Для завершения ' +
        'регистрации пройдите по указанной ссылке: <a target="_blank" href="' + message.verifyURL +
        '">ТЫК!</a>'
    };
    var transporter = nodemailer.createTransport(smtp);
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return done(err);
        }
        console.log('Message sent: ' + info.response);
        done();
    });
};
