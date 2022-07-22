const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
    minlength: [2, 'Поле {PATH} минимально 2 символа.'],
    maxlength: [30, 'Максимально 30 символов.'],
  },

  about: {
    type: String,
    required: [true, 'Поле  {PATH} обязательно.'],
    minlength: [2, 'Поле {PATH} минимально 2 символа.'],
    maxlength: [30, 'Максимально 30 символов.'],
  },

  avatar: {
    type: String,
    required: [true, 'Поле {PATH} обязательно.'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
