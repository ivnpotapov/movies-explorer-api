require('dotenv').config();

const { NODE_ENV } = process.env;
let { JWT_SECRET, PORT, DB_URL } = process.env;

if (NODE_ENV !== 'production') {
  DB_URL = 'mongodb://localhost:27017/bitfilmsdb';
  PORT = 3000;
  JWT_SECRET = 'secret';
}

const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

module.exports = {
  JWT_SECRET,
  NODE_ENV,
  PORT,
  DB_URL,
  URL_PATTERN,
};
