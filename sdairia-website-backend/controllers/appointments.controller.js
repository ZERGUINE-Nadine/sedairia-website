const appointmentsService = require('../services/appointments.service');

const booking = async (request, response) => {
    const userId = request.params.id;
    const payload = request.body;

    try {
        const result = await appointmentsService.bookAppointment(payload, userId);
        if (!result.success) {
            response.status(400).send({
                success: false,
                error: result.error
            });
            return;
        }
        response.status(201).send();
    } catch (error) {
        console.error(error);
        response.status(500).send({
            success: false,
            error: `internal server error: ${error}`
        });
    }
}

const getAll = async (request, response) => {
    const bookedAppointments = await appointmentsService.getAllAppointments();
    response.status(200).send(bookedAppointments);
}


const getByUser = async (request, response) => {
    const userId = request.params.id;
    const bookings = await appointmentsService.getUserAppointments(userId)
    response.status(200).send(bookings);
}

const cancelAppointment = async (request, response) => {
    const appointmentId = request.params.id;
    await appointmentsService.cancelAppointment(appointmentId);
    response.status(200).send({
        success: true,
        message: 'Appointment cancelled successfully',
    })
}

const remove = async (request, response) => {
    const appointmentId = request.params.id;
    await appointmentsService.deleteAppointment(appointmentId);
    response.status(200).send({
        success: true,
        message: 'Appointment deleted successfully',
    });
}


module.exports = {
    booking,
    getAll,
    getByUser,
    remove,
    cancelAppointment
}