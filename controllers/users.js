const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/status');

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

// GET /users/me - возвращает информацию о текущем пользователе

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      console.log('user', user);
      res.status(CREATED_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(400).send({ message: 'Данный пользователь зарегистрирован' });
        return;
      }

      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: `${Object.values(err.errors).map((error) => error.message).join(' ')}` });
        return;
      }
      console.log(err.code);
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователи не найдены.' });
        return;
      }
      res.status(OK_STATUS).send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Не верный ID пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некоректный ID пользователя.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: `${Object.values(err.errors).map((error) => error.message).join(' ')}` });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Некоректный ID пользователя.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: `${Object.values(err.errors).map((error) => error.message).join(' ')}` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: `Внутренняя ошибка сервера. ${err}` });
    });
};

module.exports = {
  login,
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
