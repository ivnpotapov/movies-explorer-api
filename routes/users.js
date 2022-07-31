const router = require('express').Router();
const { validateSetUser } = require('../helpers/validation');
const { getUser, setUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch(
  '/me',
  validateSetUser,
  setUser,
);

module.exports = router;
