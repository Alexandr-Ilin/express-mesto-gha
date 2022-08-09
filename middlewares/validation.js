const { celebrate, Joi } = require('celebrate');

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
      .uri(),
  }),
});

const validationGetUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
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
      .uri(),
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
      .uri(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .required()
      .min(6),
  }).unknown(),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .required()
      .min(6),
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
