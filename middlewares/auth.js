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

module.exports.setUserRole = (req, res, next) => {
    var userRole;
    if (!req.user) {
        userRole = 'anon';
    } else {
        userRole = req.user.username === 'admin' ? 'admin' : 'user';
    }
    req.userRole = userRole;
    next();
};
