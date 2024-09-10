const userModel = require('../database/entities/user.entity');
const {password} = require("pg/lib/native");
const User = require("../database/entities/user.entity");

const bcrypt = require('bcryptjs');


async function getAllUsers() {
    return await userModel.findAll({
        order: [['role', 'DESC']]
    });
}


async function deleteUser(userId) {
    try {
        await userModel.destroy({
            where: { id: userId }
        });
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

async function createNewUser(user) {
    const existingUser = await userModel.findOne({
        where: {email: user.email}
    });
    if (existingUser) {
        return {success: false, error: 'Utilisateur exist déja'};
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await userModel.create({
        fullName: user.fullName,
        email: user.email,
        password: hashedPassword,
        role: user.role
    });
}

async function updateUser(userId, user) {
    const userEntity = await userModel.findOne({
        where: {id: userId}
    });
    if (!userEntity) {
        return {success: false, error: 'Utilisateur not found'};
    }
    userEntity.email = user.email;
    userEntity.role = user.role;
    userEntity.fullName = user.fullName;

    const updatedUser = await userEntity.save();
    return { success: true, user: updatedUser }
}

module.exports = {
    getAllUsers,
    deleteUser,
    createNewUser,
    updateUser,
};
