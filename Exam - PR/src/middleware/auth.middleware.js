const jwt = require('jsonwebtoken');
const { MSG } = require('../utils/msg');
const { errorResponse } = require('../utils/response');

module.exports.authMiddleware = (req, res, next) => {

    let token = req.headers.authorization;

    if (!token) {
        return res.status(400).json(errorResponse(400, true, MSG.TOKEN_MISSING));
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(400).json(errorResponse(400, true, MSG.TOKEN_INVALID));
    }
};