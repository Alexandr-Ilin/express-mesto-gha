const userRouter = require('express').Router();

const {
  // createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// userRouter.post('/', createUser);

userRouter.get('/', getUsers);

userRouter.get('/:id', getUserById);

userRouter.patch('/me', updateUserProfile);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
