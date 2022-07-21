const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
    minlength: [2, 'Минимально 2 символа.'],
    maxlength: [30, 'Максимально 30 символов.'],
  },

  link: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
    minlength: 2,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле {PATH} обязательно.'],
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
});

module.exports = mongoose.model('card', cardSchema);
