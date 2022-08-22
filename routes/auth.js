const router = require('express').Router();
const { validateSignin, validateSignup } = require('../helpers/validation');
const { createUser, login } = require('../controllers/users');

router.post('/signin', validateSignin, login);

router.post('/signup', validateSignup, createUser);

module.exports = router;
