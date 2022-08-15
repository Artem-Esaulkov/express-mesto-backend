const Card = require('../models/card');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const message = 'Произошла ошибка сервера';
function parseError(res, err) {
  return res.status(err.statusCode).send({ message: err.message });
}

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(500).send({ message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) {
        return res.send({ data: cards });
      }
      return parseError(res, new NotFoundError('Карточки не найдены'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(500).send({ message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card && (req.user._id === card.owner.toString())) {
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => res.status(200).send({ deletedCard, message: 'Карточка успешно удалена' }));
    } if (!card) {
      return parseError(res, new NotFoundError('Карточки не найдены'));
    } return parseError(res, new ForbiddenError('У вас нет прав на удаление карточки'));
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(500).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return parseError(res, new NotFoundError('Карточки не найдены'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(500).send({ message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return parseError(res, new NotFoundError('Карточки не найдены'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return parseError(res, new BadRequestError('Переданы некорректные данные карточки'));
      } return res.status(500).send({ message });
    });
};
