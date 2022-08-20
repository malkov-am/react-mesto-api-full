// Импорты
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateSignup, validateSignin } = require('./middlewares/requestValidation');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000 } = process.env;

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
// Логгер запросов
app.use(requestLogger);

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Маршруты, не требующие аутентификации
app.use('/signin', validateSignin, login);
app.use('/signup', validateSignup, createUser);
// Защищенные маршруты
app.use(auth);
app.get('/signout', logout);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// Неправильный URL
app.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Ресурс не найден. Проверьте URL и метод запроса.' }));
});

// Логгер ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT);
