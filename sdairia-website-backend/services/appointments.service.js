const userModel = require("../database/entities/user.entity");
const appointmentModel = require("../database/entities/appointment.entity");


async function bookAppointment(payload, userId) {
    try {
        const newAppointment = await appointmentModel.create({
            date: payload.date,
            time: payload.time,
            fullDate: payload.fullDate,
            motif: payload.motif,
            status: 'en cours',
            userId: userId
        });
        return { success: true, newAppointment: newAppointment };
    } catch (error) {
        console.log(error);
        return { success: false, error: `failed to create appointment ${error}` };
    }
}

async function getAllAppointments() {
    return  await appointmentModel.findAll();
}

async function getUserAppointments(userId) {
    return await appointmentModel.findAll({
        userId: userId
    });
}

async function cancelAppointment(appointmentId) {
    const appointmentEntity = await appointmentModel.findOne({
        where: {id: appointmentId}
    });

    appointmentEntity.status = 'annuler';
    await appointmentEntity.save();
}

async  function deleteAppointment(appointmentId) {
    try {
        await appointmentModel.destroy({
            where: {id: appointmentId}
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    bookAppointment,
    getAllAppointments,
    getUserAppointments,
    cancelAppointment,
    deleteAppointment,
}