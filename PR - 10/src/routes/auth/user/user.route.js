const express = require("express");
const { 
    registerUser, 
    loginUser, 
    fetchAllUsers, 
    forgotPassword, 
    verifyOTP, 
    changePassword, 
    deleteUser, 
    activeOrInactiveUser, 
    userProfile 
} = require("../../../controllers/auth/user/user.controller");
const { authMiddleware } = require("../../../middleware/auth.middleware");

const userRoute = express.Router();

userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)
userRoute.post('/forgot_password', forgotPassword)
userRoute.post('/verify_otp', verifyOTP)
userRoute.post('/change_password', changePassword)

userRoute.get('/', authMiddleware, fetchAllUsers)
userRoute.delete('/', authMiddleware, deleteUser)
userRoute.patch('/', authMiddleware, activeOrInactiveUser)
userRoute.get('/profile', authMiddleware, userProfile)

module.exports = userRoute;