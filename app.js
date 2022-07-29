const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { PORT, DB_URL } = require('./helpers/envConsts');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/movie');
const routesAuth = require('./routes/auth');
const handleError = require('./errors/handleError');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { handleAuth } = require('./middlewares/auth');
const { handleCors } = require('./middlewares/handleCors');

const app = express();

mongoose.connect(DB_URL);

app.use(handleCors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use('/', routesAuth);

app.use(handleAuth);

app.use('/movies', routesCards);
app.use('/users', routesUsers);
app.use('/*', () => {
  throw new ErrorNotFound('Путь не найден');
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {});
