module.exports.loginRequired = (req, res, next) => {
    if (req.user) {
        return next();
    }

    req.session.deniedAddress = req.originalUrl;
    res.redirect('/signin');
};
