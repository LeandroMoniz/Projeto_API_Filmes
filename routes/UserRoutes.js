const router = require('express').Router()

const UserController = require('../controllers/UserController');

// middleware
const verifyToken = require('../helpers/verify-token')

// Admin
router.post('/registerAdmin', verifyToken, UserController.registerAdmin)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', verifyToken, UserController.getUserById)
router.patch('/edit', verifyToken, UserController.editAdmin)

module.exports = router;
