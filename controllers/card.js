const Card = require('../models/card');
const errorCallback = require('../error');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch(errorCallback);
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) {
        return res.send({ data: cards });
      }
      return res.status(404).send({ message: 'Карточки не найдены' });
    })
    .catch(errorCallback);
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(errorCallback);
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(errorCallback);
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(errorCallback);
};
