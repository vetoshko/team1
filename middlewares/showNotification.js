module.exports = (req, res, next) => {
    res.showNotification = (message) => {
        req.session.message = message;
        res.redirect('/notification');
    };

    next();
};
