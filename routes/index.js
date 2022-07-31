const router = require('express').Router();
const routesUsers = require('./users');
const routesMovies = require('./movie');
const routesAuth = require('./auth');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { handleAuth } = require('../middlewares/auth');

router.use('/', routesAuth);

router.use(handleAuth);

router.use('/movies', routesMovies);
router.use('/users', routesUsers);
router.use('/*', () => {
  throw new ErrorNotFound('Путь не найден');
});

module.exports = router;
