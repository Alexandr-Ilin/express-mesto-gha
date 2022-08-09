const Card = require('../models/card');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const {
  OK_STATUS,
  CREATED_STATUS,
} = require('../utils/consts');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' ')}`));
        return;
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(OK_STATUS).send(cards);
        return;
      }
      res.status(OK_STATUS).send(cards);
    })
    .catch(next);
};

const getCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Пользователь с таким ID не найден.'));
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Не верный ID пользователя.'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с таким ID не найдена.'));
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы можете удалять только свои карточки'));
        return;
      }
      console.log(card);
      Card.findByIdAndDelete(req.params.id)
        .then(() => res.status(OK_STATUS).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный ID карточки'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError({ message: 'Карточка с таким ID не найдена.' }));
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные ID карточки или пользователя.'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError({ message: 'Карточка с таким ID не найдена.' }));
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные ID карточки или пользователя.'));
      }
      next(err);
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
