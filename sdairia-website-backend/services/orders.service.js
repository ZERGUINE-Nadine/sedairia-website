const orderModel = require('../database/entities/orders.entity');

async function createNewOrder(payload, files)  {
    const order = await orderModel.create({
        motif: payload.motif,
        description: payload.description,
        userId: payload.userId,
        files: files,
        status: 'en cours',
    });
}

async function getUserRequests(userId) {
    return await orderModel.findAll({
        where: {userId: userId},
    });
}

module.exports = {
    createNewOrder,
    getUserRequests
}