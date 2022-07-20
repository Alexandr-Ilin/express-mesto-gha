const cardRouter = require('express').Router()

const { createCard, getCards, deleteCard, likeCard, dislikeCard, getCardById } = require('../controllers/cards')

cardRouter.post('/cards', createCard)

cardRouter.get('/cards', getCards)

cardRouter.delete('/cards/:id', deleteCard)

cardRouter.put('/cards/:cardId/likes', likeCard)

cardRouter.delete('/cards/:cardId/likes', dislikeCard)

cardRouter.get('/cards/:id', getCardById)

module.exports = cardRouter;