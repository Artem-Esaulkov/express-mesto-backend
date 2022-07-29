const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/user');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userId', getUserId);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
