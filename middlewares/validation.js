const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../utils/errors/BadRequestError');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат ссылки');
  }
  return value;
};

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((value) => validateURL(value)),
  }),
});

const validationGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .alphanum()
      .length(24),
  }),
});

const validationGetCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .alphanum()
      .length(24),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30),
    link: Joi.string()
      .required()
      .custom((value) => validateURL(value)),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
    avatar: Joi.string()
      .custom((value) => validateURL(value)),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .required(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .required(),
  }),
});

const validationAuth = celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string()
      .required(),
  }),
});

module.exports = {
  validationUpdateUser,
  validationUpdateAvatar,
  validationGetUserById,
  validationGetCardById,
  validationCreateCard,
  validationCreateUser,
  validationLogin,
  validationAuth,
};
