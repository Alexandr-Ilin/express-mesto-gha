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

cardRouter.delete('/:id', validationGetCardById, deleteCard);

cardRouter.put('/:cardId/likes', validationGetCardById, likeCard);

cardRouter.delete('/:cardId/likes', validationGetCardById, dislikeCard);

cardRouter.get('/:id', validationGetCardById, getCardById);

module.exports = cardRouter;
