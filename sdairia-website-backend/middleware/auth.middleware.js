const authService = require("../services/auth.service");


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "user not authenticated, no token provided",
        });
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            error: 'Invalid Authorization format. Expected "Bearer <token>"'
        });
    }

    const user = await authService.getUserByToken(token);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "invalid token was provided",
        });
    }

    req.user = user;
    next();
}

module.exports = authMiddleware;