const express = require("express");

const { registerAdmin, loginAdmin, fetchAllAdmins, forgotPassword, verifyOTP, changePassword, deleteAdmin, activeOrInactiveAdmin, adminProfile,  } = require("../../../controllers/auth/admin/admin.controller");
const { authMiddleware } = require("../../../middleware/auth.middleware");


const adminRoute = express.Router();

adminRoute.post('/register', registerAdmin)
adminRoute.post('/login', loginAdmin)
adminRoute.post('/forgot_password', forgotPassword)
adminRoute.post('/verify_otp', verifyOTP)
adminRoute.post('/change_password', changePassword)


adminRoute.get('/',authMiddleware, fetchAllAdmins)
adminRoute.delete('/', authMiddleware, deleteAdmin )
adminRoute.patch("/", authMiddleware, activeOrInactiveAdmin)
adminRoute.get('/profile',authMiddleware, adminProfile)

module.exports = adminRoute;