const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const User = require('../models/user');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const ErrorConflict = require('../errors/ErrorConflict');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new ErrorUnauthorized('Неправильный Email или пароль')); // 401
      }

      const isPasswordCorrect = bcrypt.compare(password, user.password);

      return Promise.all([user, isPasswordCorrect]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        return next(new ErrorUnauthorized('Неправильный Email или пароль')); // 401
      }
      return generateToken(user._id);
    })
    .then((token) => {
      res.send({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ErrorConflict('Email занят'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.setUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict('Email занят'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};
