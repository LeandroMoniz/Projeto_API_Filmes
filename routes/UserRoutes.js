const router = require('express').Router();

const UserController = require('../controllers/UserController');

// middleware
const verifyToken = require('../helpers/verify-token');

// Admin
router.post('/registerAdmin', verifyToken, UserController.registerAdmin);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.delete('/removeUsers', verifyToken, UserController.deleteUsers);

// Common Admin e Users
router.patch('/edit', verifyToken, UserController.editUsers);
router.get('/:id', verifyToken, UserController.getUserById);
router.patch('/deactivation', verifyToken, UserController.deactivation);

// Users 
router.post('/register', UserController.registerUsers);

module.exports = router;
