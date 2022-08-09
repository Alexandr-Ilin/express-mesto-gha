const cardRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
} = require('../controllers/cards');

const {
  validationGetCardById,
  validationCreateCard,
} = require('../middlewares/validation');

cardRouter.post('/', validationCreateCard, createCard);

cardRouter.get('/', getCards);

cardRouter.get('/:id', validationGetCardById, getCardById);

cardRouter.delete('/:id', deleteCard);

cardRouter.put('/:cardId/likes', validationGetCardById, likeCard);

cardRouter.delete('/:cardId/likes', validationGetCardById, dislikeCard);

module.exports = cardRouter;
