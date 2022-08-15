const express = require('express');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');
const users = require('./routes/user');
const cards = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());

app.use('/cards', auth, cards);
app.use('/users', auth, users);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/\S+/),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  const err = new NotFoundError('Данной страницы не существует');
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.use(errors());

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
