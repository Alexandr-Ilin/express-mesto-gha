const userRouter = require('express').Router();

const {
  getMe,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationGetUserById,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);

userRouter.get('/me', getMe);

userRouter.get('/:id', validationGetUserById, getUserById);

userRouter.patch('/me', validationUpdateUser, updateUserProfile);

userRouter.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
