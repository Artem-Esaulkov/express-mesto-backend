const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/user');
const cards = require('./routes/card');
const pageNotFound = require('./routes/user');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62e37709e814e340104b8643',
  };

  next();
});

app.use('/cards', cards);
app.use('/users', users);
app.use('/404', pageNotFound);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
