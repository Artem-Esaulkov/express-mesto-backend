const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getUserId,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/\S+/),
  }),
}), updateUserAvatar);

module.exports = router;
