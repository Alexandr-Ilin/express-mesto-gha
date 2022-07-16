const Card = require('../models/card')

const createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user._id

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(`Переданы некорректные данные при создании карточки. ${err}`)
        return
      }
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${ err }` })
    })
}

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: "Карточки не найдены" });
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(200).send(`карточка удалена, ${card}`);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Неверный ID карточки: ${err}` })
        return
      }
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` })
    })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
      req.params.cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send(`Карточка с таким ID не найден.`)
        return
      }
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Неверные ID карточки или пользователя: ${err}` })
        return
      }
      res.status(500).send(`Внутренняя ошибка сервера: ${err}`)
    })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send(`Карточка с таким ID не найден.`)
        return
      }
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Неверные ID карточки или пользователя: ${err}` })
        return
      }
      res.status(500).send(`Внутренняя ошибка сервера: ${err}`)
    })
}

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
}