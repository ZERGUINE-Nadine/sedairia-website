// routes/orders.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const multerConfig = require('../middleware/multer.middleware');
const ordersController = require('../controllers/orders.controller');

router.post('/orders/submit', authMiddleware, multerConfig.array('files'), ordersController.create);
router.get('/orders/:id', authMiddleware, ordersController.getByUser)

module.exports = router;
