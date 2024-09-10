const usersService = require('../services/users.service');



const getAll = async (request, response) => {
    try {
        const users = await usersService.getAllUsers();
        response.status(200).json(users);
    } catch (error) {
        console.log(error);
        response.status(500).json({error: 'internal server error'});
    }
}

const destroy = async (request, response) => {
    const userId = request.params.id;
    const deleted = await usersService.deleteUser(userId);
    if (!deleted) {
        response.status(404).send({error: 'user not found'});
        return
    }
    return response.status(204).send({message: 'user deleted'});
}

const create = async (request, response) => {
    const payload = request.body;
    const result = await usersService.createNewUser(payload);
    if (result.success === false) {
        response.status(404).send({error: result.error});
        return;
    }
    response.status(201).send({
        message: 'user created successfully',
        user: result
    });
}

const update = async (request, response) => {
    const payload = request.body;
    const userId = request.params.id;
    const result = await usersService.updateUser(userId, payload);
    if (result.success === false) {
        response.status(404).send({error: result.error});
        return;
    }
    response.status(201).send({message: 'user updated successfully'});
}


module.exports = {
    getAll,
    destroy,
    create,
    update
}