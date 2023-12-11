const router = require('express').Router()

const UserController = require('../controllers/UserController');

// middleware
const verifyToken = require('../helpers/verify-token')


router.post('/registerAdmin', UserController.registerAdmin)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', verifyToken, UserController.getUserById)


module.exports = router;
