const User = require('../models/user');

const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/status');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Данные не корректны.' });
        return;
      }
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
  User.findById(req.params.id)
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
        res.status(BAD_REQUEST_STATUS).send({ message: 'Введены некоректные новые данные.' });
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
        res.status(BAD_REQUEST_STATUS).send({ message: 'Введены некоректные новые данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
