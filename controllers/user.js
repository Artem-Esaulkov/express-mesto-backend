const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-req-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const AuthorizationError = require('../errors/auth-err');
const User = require('../models/user');

function parseError(res, err) {
  return res.status(err.statusCode).send({ message: err.message });
}

const message = 'Произошла ошибка сервера';

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные пользователя'));
      }
      if (err.code === 11000) {
        return parseError(res, new ConflictError('Такой пользователь уже есть в базе данных'));
      }
      return res.status(500).send({ message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length > 0) {
        return res.send({
          data: user,
        });
      }
      return parseError(res, new NotFoundError('Пользователи не найдены'));
    })
    .catch(() => res.status(500).send({ message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return parseError(res, new NotFoundError('Пользователи не найдены'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные пользователя'));
      } return res.status(500).send({ message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(() => res.status(500).send({ message }));
};

const updateParams = {
  new: true,
  runValidators: true,
};

module.exports.updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    updateParams,
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные пользователя'));
      } return res.status(500).send({ message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    updateParams,
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные пользователя'));
      } return res.status(500).send({ message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => parseError(res, new AuthorizationError('Неправильные почта или пароль')));
};
