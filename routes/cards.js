const cardRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
} = require('../controllers/cards');

cardRouter.post('/', createCard);

cardRouter.get('/', getCards);

cardRouter.delete('/:id', deleteCard);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', dislikeCard);

cardRouter.get('/:id', getCardById);

module.exports = cardRouter;
