const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')

const { PORT = 3000 } = process.env;

const app = express();



// mongoose.connect('mongodb://localhost:27017/mestodb', {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
mongoose.connect('mongodb://localhost:27017/mestodb', {
    //useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    //useUnifiedTopology: true,
  })
  .then((res) => console.log('ok'))
  .catch((err) => console.log(err))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    //_id: '62d1630fca49d61964bb431d' // пользователя нет
    _id: '62d81f242d709b2bb0731967' // пользователь есть
  };

  next();
});

app.use('/', userRouter)
app.use('/', cardRouter)

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});


app.listen(PORT, () => {
  console.log(`Приложение работает. Порт: ${PORT}`);
});