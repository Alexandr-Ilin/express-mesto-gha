const User = require('../models/user')

const createUser = (req, res) => {
  const { name, about, avatar } = req.body


  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Данные не корректны ${err}` })
        return
      }
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${ err }` })
    })
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: "Пользователи не найдены" });
        return;
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
    })
}

const getUserById = (req, res) => {
  //const { id } = req.params
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send(`Пользователь с таким ID не найден.`)
        return
      }
      res.status(200).send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Не верный ID пользователя ${err}` })
        return
      }
      res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` })
    })
}

const updateUserProfile = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send(`Пользователь с таким ID не найден.`)
        return
      }
      res.status(200).send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(`Некоректный ID пользователя: ${err}`)
        return
      }
      if (err.name === 'ValidationError') {
        res.status(400).send(`Введены некоректные новые данные ${err}`)
        return
      }
      res.status(500).send(`Внутренняя ошибка сервера: ${err}`)
    })
}

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send(`Пользователь с таким ID не найден.`)
        return
      }
      res.status(200).send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(`Некоректный ID пользователя: ${err}`)
        return
      }
      if (err.name === 'ValidationError') {
        res.status(400).send(`Введены некоректные новые данные ${err}`)
        return
      }
      console.log(err.name)
      res.status(500).send(`Внутренняя ошибка сервера: ${err}`)
    })
}


module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
}