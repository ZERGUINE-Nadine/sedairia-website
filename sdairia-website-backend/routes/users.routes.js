const userController = require("../controllers/users.controller");
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');


router.get('/users/all', authMiddleware, userController.getAll);
router.delete('/users/delete/:id', authMiddleware, userController.destroy);
router.post('/users/create', authMiddleware, userController.create);
router.patch('/users/update/:id', authMiddleware, userController.update);

module.exports = router;