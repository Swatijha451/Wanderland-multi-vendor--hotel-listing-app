const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controller/user.js');

router.get('/signup', userController.renderSignupForm);

router.post('/signup', wrapAsync(userController.signupUser));

router.get('/login', userController.renderLoginForm);

router.post(
	'/login',
	saveRedirectUrl,
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true,
	}),
	userController.loginUser
);

router.get('/logout', userController.logoutUser);
module.exports = router;
