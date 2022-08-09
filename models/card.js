const mongoose = require('mongoose');
const { regex } = require('../utils/consts');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
    minlength: [2, 'Поле {PATH} минимально 2 символа.'],
    maxlength: [30, 'Максимально 30 символов.'],
  },

  link: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
    validate: {
      validator: (str) => regex.test(str),
      message: 'Формат ссылки не верен',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
