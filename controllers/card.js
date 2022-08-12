const Card = require('../models/card');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const message = 'Произошла ошибка сервера';

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(res.status(500).send({ message }));
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) {
        return res.send({ data: cards });
      }
      return next(new NotFoundError('Карточки не найдены'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(res.status(500).send({ message }));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card && (req.user._id === card.owner.toString())) {
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => res.status(200).send({ deletedCard, message: 'Карточка успешно удалена' }));
    } if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    } return next(new ForbiddenError('У вас нет прав на удаление карточки'));
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(res.status(500).send({ message }));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(res.status(500).send({ message }));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      } return next(res.status(500).send({ message }));
    });
};
