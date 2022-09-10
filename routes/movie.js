const router = require('express').Router();
const { validateCreateMovie, validateDeleteMovie } = require('../helpers/validation');
const { createMovie, getMovies, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);

router.post(
  '/',
  validateCreateMovie,
  createMovie,
);

router.delete(
  '/:_id',
  validateDeleteMovie,
  deleteMovie,
);

module.exports = router;
