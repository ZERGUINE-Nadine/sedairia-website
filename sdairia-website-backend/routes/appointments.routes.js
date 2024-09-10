const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointments.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/appointment/book/:id', authMiddleware, appointmentController.booking);
router.get('/appointment/all', authMiddleware, appointmentController.getAll);
router.get('/appointment/user/:id', authMiddleware, appointmentController.getByUser)
router.get('/appointment/cancel/:id', authMiddleware, appointmentController.cancelAppointment);
router.delete('/appointment/delete/:id', authMiddleware, appointmentController.remove);

module.exports = router;