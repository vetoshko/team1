module.exports.loginRequired = (needRedirect) => {
    return (req, res, next) => {
        if (req.user) {
            return next();
        }

        if (needRedirect) {
            req.session.deniedAddress = req.originalUrl;
            return res.redirect('/signin');
        }

        return res.sendStatus(401);
    };
};
