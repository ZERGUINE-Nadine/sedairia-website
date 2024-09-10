const ordersService = require('../services/orders.service');

const create = async (request, response) => {
    try {
        const { motif, description, userId } = request.body;
        const files = request.files.map((file) => 'uploads/' + file.filename.replace(/\s+/g, ''));
        const payload = {
            motif: motif,
            description: description,
            userId: userId,
        }
        console.log(payload)
        await ordersService.createNewOrder(payload, files);

        response.status(200).json({ message: 'Files uploaded successfully.', files });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'File upload failed', error });
    }
};

const getByUser = async (request, response) => {
    const requests = await ordersService.getUserRequests(request.params.id);
    response.status(200).send(requests);
}

module.exports = {
    create,
    getByUser
};
