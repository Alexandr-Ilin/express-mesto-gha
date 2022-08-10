const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/consts');
const UnauthtorizedError = require('../utils/errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // тут будет вся авторизация
  const { jwt: token } = req.cookies;
  if (!token) {
    next(new UnauthtorizedError('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthtorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
