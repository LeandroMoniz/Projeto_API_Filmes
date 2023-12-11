const router = require('express').Router()

const UserController = require('../controllers/UserController');


router.post('/registerAdmin', UserController.registerAdmin)
router.post('/login', UserController.login)


module.exports = router;
