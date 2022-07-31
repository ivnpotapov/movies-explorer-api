const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { PORT, DB_URL } = require('./helpers/envConsts');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRoutes = require('./routes/index');
const handleError = require('./errors/handleError');
const { handleCors } = require('./middlewares/handleCors');
const limiter = require('./middlewares/limiter');

const app = express();

mongoose.connect(DB_URL);

app.use(helmet());
app.use(handleCors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.use(indexRoutes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {});
