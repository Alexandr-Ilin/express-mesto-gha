const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const BadRequestError = require('../utils/errors/BadRequestError');

const {
  OK_STATUS,
  CREATED_STATUS,
  JWT_SECRET,
} = require('../utils/consts');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Вы успешно авторизировались' });
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => {
      res.status(CREATED_STATUS).send({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        _id: data._id,
        email: data.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данный пользователь зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' ')}`));
        return;
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        next(new NotFoundError('Пользователи не найдены.'));
        return;
      }
      res.status(OK_STATUS).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя с таким id'));
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Не верный ID пользователя.'));
        return;
      }
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError({ message: 'Пользователь с таким ID не найден.' }));
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некоректный ID пользователя.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' ')}`));
        return;
      }

      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Некоректный ID пользователя.'));
        return;
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некоректный ID пользователя.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' ')}`));
        return;
      }
      next(err);
    });
};

module.exports = {
  login,
  getMe,
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
