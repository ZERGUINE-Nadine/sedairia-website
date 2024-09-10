const authService = require('../services/auth.service');


const login = async (request, response) => {
    const { email, password } = request.body;

    try {
        const result = await authService.login(email, password);
        if (result.success === false) {
            response.status(400).send({
                success: false,
                error: "mot de pass ou email incorect !"
            })
            return ;
        }

        response.status(200).send({
            result
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return response.status(500).json({ error: 'Erreur serveur' });
    }

}



const  signup = async (request, response) => {
    const { email, password, name, role } = request.body;

    try {
        const user = await authService.signup(email, password, name, role);

        if (user === false) {
            response.status(401).send({error: 'cet utilisateur exist déja'});
            return;
        }

        response.status(200).send({
            message: 'utilisateur créer avec success',
            utilisateur: user
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return response.status(500).json({ message: 'Erreur serveur' });
    }
}

const logout = async (request, response) => {
    try {
        const user = request.user;
        const  result = await authService.logout(user);

        if (result === true) {
            response.status(200).send({
                message: 'utilisateir déconnecter',
            });
        } else {
            response.status(400).send({
                error: 'bad request'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return response.status(500).json({ message: 'Erreur serveur' });
    }
}

const getUserData = async (req, res) => {
    const user = await authService.getUserByToken(req.user.token);

    if (!user) {
        res.status(400).send({
            error: 'bad request'
        });
        return;
    }

    res.status(200).send(user)
}

module.exports = {
    login ,
    signup,
    logout,
    getUserData ,
}
