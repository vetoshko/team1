var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var config = require('config');
var MongoStore = require('connect-mongo')(expressSession);

//routes
var routes = require('./routes/index');
var users = require('./routes/users');
var authRoutes = require('./routes/auth');
var questRoutes = require('./routes/quests');
var questCreationRoutes = require('./routes/quest-creation');
var commentRoutes = require('./routes/comments');
var likeRoutes = require('./routes/likes');
var notificationRoutes = require('./routes/notification');

//middlewares
var authMiddlewares = require('./middlewares/auth.js');
var showNotificationMiddleware = require('./middlewares/showNotification.js');

var secretKey = require('config').get('secretKey');

var cloudinary = require('cloudinary');

cloudinary.config(require('config').get('cloudinary'));

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'bundles'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    secret: secretKey,
    store: new MongoStore({
        url: config.get('db.connectionString')
    }),
    resave: false,
    saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(authMiddlewares.setUserRole);
app.use(showNotificationMiddleware);

app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.userRole = req.userRole;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/', authRoutes);
app.use('/', commentRoutes);
app.use('/', likeRoutes);
app.use('/quests/new-quest', questCreationRoutes);
app.use('/quests', questRoutes);
app.use('/notification', notificationRoutes);

require('./controllers/auth/auth-config');
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
        message: err.message,
        error: {}
    });
});

app.locals = {
    isDev: process.env.NODE_ENV !== 'production',
    bundleBase: require('config').get('bundleBase')
};

module.exports = app;
