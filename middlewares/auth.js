const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/consts');

module.exports = (req, res, next) => {
  // тут будет вся авторизация
  const { jwt: token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};
