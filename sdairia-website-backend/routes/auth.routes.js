// creating express router instance //
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');


const authController = require('../controllers/auth.controller');

// router waiting for get http request on /login route to apply login function //
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authMiddleware ,authController.logout);
router.get('/get_user_data', authMiddleware, authController.getUserData);

// exporting router //
module.exports = router;