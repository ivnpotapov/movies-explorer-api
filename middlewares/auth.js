const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const { checkToken } = require('../helpers/jwt');

module.exports.handleAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Необходима авторизация')); // 401
  }

  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = checkToken(token);
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация')); // 401
  }

  req.user = payload;

  next();
};
