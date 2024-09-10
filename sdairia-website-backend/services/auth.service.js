const User = require('../database/entities/user.entity');
const e = require("express");
const bcrypt = require('bcryptjs');
const securityUtils = require('../utils/security.utils')


async function signup(email, password, name, role) {
    const existingUser = await User.findOne({
        where: { email: email }
    });

    if (existingUser) {
        return false;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
        email: email,
        password: hashedPassword,
        fullName: name,
        role: role
    });
}

async function login(email, password) {
    try {
        const user = await User.findOne({where: {email: email}});

        if (!user) {
            return {success: false, error: 'Utilisateur non trouvé'};
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {success: false, message: 'Mot de passe ou email incorrect'};
        }

        const userToken = securityUtils.getToken();

        user.token = userToken;
        await user.save();

        return {
            success: true,
            message: 'Connexion réussie',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                token: userToken
            }
        };
    } catch (error) {
        console.error('Error during login:', error);
        return {success: false, message: 'Erreur interne du serveur'};
    }
}

async function logout(user) {
    const userEntity = await getUserByToken(user.token);

    userEntity.token = null;

    userEntity.save();
    return Promise.resolve(true); ;
}

async function getUserByToken(token) {
    return await User.findOne({where: {token: token}}) || null;
}


module.exports = {
    login,
    signup,
    getUserByToken,
    logout
}
