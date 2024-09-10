const cron = require('node-cron');
const { Op } = require('sequelize');
const appointmentsModel = require('../database/entities/appointment.entity');

function scheduleCronJobs () {
    cron.schedule('0 0 * * *', async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result = await appointmentsModel.destroy({
                where: {
                    fullDate: {
                        [Op.lt]: today
                    }
                }
            });
            console.log(`${result} appointments deleted.`);
        } catch (error) {
            console.error('Error deleting appointments:', error);
        }
        console.log('cron job executed successfully.');
    });
}

module.exports = scheduleCronJobs;