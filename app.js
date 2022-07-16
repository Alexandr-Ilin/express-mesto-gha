const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62d15eef401fd13abc3fdfc1' // пользователя нет
      //_id: '62d1630fca49d61964bb431d' // пользователя есть
      //_id: '62d1630fca49d61964bb431' // неправельный
  };

  next();
});

app.use('/', userRouter)
app.use('/', cardRouter)


mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('ok'))
  .catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Приложение работает. Порт: ${PORT}`);
});