const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new UnauthorizedError('Необходима авторизация');
    return next(res.status(error.statusCode).send({ message: error.message }));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    const error = new UnauthorizedError('Необходима авторизация');
    return next(res.status(error.statusCode).send({ message: error.message }));
  }

  req.user = payload;

  next();
};
