const UserController = require('../controllers/UserController');

const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Connection OK', status: 200 })
})


router.post('/login', UserController.login);
router.post('/register', UserController.register);

router.use(auth)


module.exports = router;