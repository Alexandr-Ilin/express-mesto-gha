const userRouter = require('express').Router()

const { createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar } = require('../controllers/users')

userRouter.post('/users', createUser)

userRouter.get('/users', getUsers)

userRouter.get('/users/:id', getUserById)

userRouter.patch('/users/me', updateUserProfile)

userRouter.patch('/users/avatar', updateUserAvatar)

module.exports = userRouter;