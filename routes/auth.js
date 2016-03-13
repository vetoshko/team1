var express = require('express');
var router = express.Router();
var passport = require('passport');
var signin = require('../controllers/auth/signin.js');
var signup = require('../controllers/auth/signup.js');
var signout = require('../controllers/auth/signout.js');

router.get('/signup', signup.get);
router.post('/signup', signup.post);

router.post('/signin', passport.authenticate('local'), signin.post);

router.get('/signout', signout);

module.exports = router;
