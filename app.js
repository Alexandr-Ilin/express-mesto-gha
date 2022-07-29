const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_STATUS } = require('./utils/status');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   // req.user = { _id: '62d892cac8f2ccc69d9c0887' };
//   req.user = { _id: '62d16789a7a48d2610722b1f' };

//   next();
// });

app.use(cookieParser('some-secret-key'));

app.post('/signin', login);
app.post('/signup', createUser);

// app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Приложение работает. Порт: ${PORT}`);
});
