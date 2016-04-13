var express = require('express');
var router = express.Router();
var passport = require('passport');
var signin = require('../controllers/auth/signin.js');
var signup = require('../controllers/auth/signup.js');
var signout = require('../controllers/auth/signout.js');
var verification = require('../controllers/auth/verification.js');
var reset = require('../controllers/auth/password-reset.js');

router.get('/signup', signup.get);
router.post('/signup', signup.post);

router.post('/signin', passport.authenticate('local'), signin.post);

router.get('/signout', signout);

router.get('/verify/:token(*)', verification);

router.get('/reset', reset.get);
router.post('/reset', reset.post);
router.get('/reset/:token(*)', reset.getreset);
router.post('/reset/:token(*)', reset.postreset);

module.exports = router;
