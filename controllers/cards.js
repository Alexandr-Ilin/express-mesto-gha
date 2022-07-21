const Card = require('../models/card');

const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/status');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(OK_STATUS).send(cards);
        return;
      }
      res.status(OK_STATUS).send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const getCardById = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Не верный ID пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким ID не найдена.' });
        return;
      }
      res.status(OK_STATUS).send({ message: 'карточка удалена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Неверный ID карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким ID не найдена.' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Неверные ID карточки или пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким ID не найдена.' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Неверные ID карточки или пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
};
