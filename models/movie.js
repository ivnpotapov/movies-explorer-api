const mongoose = require('mongoose');
const { validateURL } = require('../helpers/validation');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: 'Неправильный формат ссылки на постер',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: 'Неправильный формат ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validateURL,
      message: 'Неправильный формат ссылки на миниатюрное изображение постера',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
