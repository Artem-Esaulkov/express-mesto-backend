const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
  pageNotFound,
} = require('../controllers/user');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userId', getUserId);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

router.patch('/', pageNotFound);

module.exports = router;
