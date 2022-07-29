const User = require('../models/user');
const errorCallback = require('../error');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(errorCallback);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length > 0) {
        return res.send({ data: user });
      }
      return res.status(404).send({ message: 'Пользователи не найдены' });
    })
    .catch(errorCallback);
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch(errorCallback);
};

const updateParams = {
  new: true,
  runValidators: true,
  upsert: true,
};

module.exports.updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    updateParams,
  )
    .then((user) => res.send({ data: user }))
    .catch(errorCallback);
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    updateParams,
  )
    .then((user) => res.send({ data: user }))
    .catch(errorCallback);
};
