const mongoose = require('mongoose');

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
