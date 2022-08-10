const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
