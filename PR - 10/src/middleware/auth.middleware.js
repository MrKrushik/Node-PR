const jwt = require("jsonwebtoken")
const { JsonWebTokenError } = require("jsonwebtoken");
const { MSG } = require("../utils/msg");
const AuthAdmin = require("../services/auth/admin/admin.service");
const AuthUser = require("../services/auth/user/user.service");
const { errorResponse } = require("../utils/response.utils");

const adminAuth = new AuthAdmin();
const userAuth = new AuthUser();

module.exports.authMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json(errorResponse(401, true, MSG.TOKEN_MISSING))
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        } else {
            return res.status(401).json(errorResponse(401, true, MSG.TOKEN_MISSING))
        }

        if (!token) {
            return res.status(401).json(errorResponse(401, true, MSG.TOKEN_MISSING))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log("Decoded token:", decoded);

            let data;

            if (decoded.isAdmin !== undefined) {
                // Admin token
                if (decoded.isAdmin) {
                    data = await adminAuth.fetchSingleAdmin({ _id: decoded.admin_id || decoded.id, isDelete: false, isActive: true }, true);
                    if (data) {
                        req.admin = data;
                        console.log("Admin authenticated:", data.email);
                    } else {
                        return res.status(401).json(errorResponse(401, true, MSG.ADMIN_UNAUTHORIZED))
                    }
                } else {
                    // User token
                    data = await userAuth.fetchSingleUser({ _id: decoded.user_id || decoded.id, isDelete: false, isActive: true });
                    if (data) {
                        req.user = data;
                        console.log("User authenticated:", data.email);
                    } else {
                        return res.status(401).json(errorResponse(401, true, MSG.USER_UNAUTHORIZED))
                    }
                }
            } else if (decoded.user_id) {
                // User token (old format)
                data = await userAuth.fetchSingleUser({ _id: decoded.user_id, isDelete: false, isActive: true });
                if (data) {
                    req.user = data;
                    console.log("User authenticated (old format):", data.email);
                } else {
                    return res.status(401).json(errorResponse(401, true, MSG.USER_UNAUTHORIZED))
                }
            } else if (decoded.admin_id) {
                // Admin token (old format)
                data = await adminAuth.fetchSingleAdmin({ _id: decoded.admin_id, isDelete: false, isActive: true }, true);
                if (data) {
                    req.admin = data;
                    console.log("Admin authenticated (old format):", data.email);
                } else {
                    return res.status(401).json(errorResponse(401, true, MSG.ADMIN_UNAUTHORIZED))
                }
            } else {
                return res.status(401).json(errorResponse(401, true, MSG.TOKEN_INVALID))
            }

            next()

        } catch (err) {
            console.log("JWT verification error:", err);
            if (err instanceof JsonWebTokenError) {
                return res.status(401).json(errorResponse(401, true, MSG.TOKEN_INVALID))
            }
            return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
        }

    } catch (err) {
        console.log("Auth middleware error:", err);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}