const Movie = require('../models/movie');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((items) => {
      const usersItem = items.filter(
        (item) => item.owner.toString() === req.user._id,
      );
      res.send(usersItem);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((item) => {
      if (!item) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else if (item.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(item._id);
      } else {
        next(
          next(new ErrorForbidden('Нельзя удалять карточки другого пользователя')),
        );
      }

      return false;
    })
    .then((item) => {
      if (!item) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else {
        res.send(item);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};
