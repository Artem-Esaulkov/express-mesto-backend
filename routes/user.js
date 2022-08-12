const router = require('express').Router();

const {
  getUsers,
  getUserId,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserId);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
