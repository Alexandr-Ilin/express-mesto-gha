const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { INTERNAL_SERVER_ERROR_STATUS } = require('./utils/consts');

const { PORT = 3000 } = process.env;

const app = express();

// const allowedCors = [
//   'http://ilin.nomoredomains.sbs',
//   'https://ilin.nomoredomains.sbs',
//   'http://localhost:3000',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.use(cors({
//   origin: allowedCors,
// }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_ERROR_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение работает. Порт: ${PORT}`);
});
