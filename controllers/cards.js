const Card = require('../models/card');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');

const {
  OK_STATUS,
  CREATED_STATUS,
  // BAD_REQUEST_STATUS,
  // NOT_FOUND_STATUS,
  // INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/status');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' ')}`);
        // return;
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
        throw new NotFoundError('Пользователь с таким ID не найден.');
        // return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Не верный ID пользователя.');
        // return;
      }
      console.log(err.message, 'err');
      next(err);
    });
};

// const deleteCard = (req, res) => {
//   getCardById(req, res);
//   .then
// };
// const getCardById = (req, res) => {
//   Card.findById(req.params.id)
//     .then((card) => {
//       if (!card) {
//         res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
//         return;
//       }
//       //  res.status(OK_STATUS).send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(BAD_REQUEST_STATUS).send({ message: 'Не верный ID пользователя.' });
//         return;
//       }
//       res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
//     });
// };
// const deleteCard = (req, res) => {
//   Card.findById(req.params.id)
//     .then((card) => {
//       if (!card) {
//         res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким ID не найден.' });
//         return;
//       }
//       if (card.owner.toString() === req.user._id) {
//         Card.findByIdAndDelete(req.params.id)
//           .then((delCard) => {
//             console.log(delCard);
//             res.status(OK_STATUS).send({ message: 'карточка удалена.' });
//           })
//           .catch(() => {
// eslint-disable-next-line max-len
//             res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
//           });
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(BAD_REQUEST_STATUS).send({ message: 'Не верный ID пользователя.' });
//         return;
//       }
//       res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Внутренняя ошибка сервера.' });
//     });
// };
//   console.log(req.params, 'owner');
//   console.log(req.user, 'user');
//   res.send('нельзя');
// };

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка с таким ID не найдена.' });
        // return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверные ID карточки или пользователя.');
        // return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка с таким ID не найдена.' });
        // return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверные ID карточки или пользователя.');
        // return;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  // deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
};
