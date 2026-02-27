const express = require('express');
const passport = require('passport');
const upload = require('../Middleware/multer.middleware');

const { loginPage,
    checkLogin,
    logout,
    changePasswordPage,
    changePassword,
    verifyEmail,
    OTPPage,
    OTPVerify,
    newPasswordPage,
    changeNewPassword,
    profilePage, dashboardPage,
    addAdminPage,
    viewAdminPage,
    insertAdmin,
    deleteAdmin,
    editAdminPage,
    updateAdmin } = require('../controllers/admin.controller');

const route = express.Router();


// Login Page
route.get('/', passport.checkAuthIsNotDone, loginPage);
route.post('/login', passport.checkAuthIsNotDone, passport.authenticate('localAuth', { failureRedirect: '/' }), checkLogin);

// Logout
route.get('/logout', passport.checkAuthIsDone, logout);

// Change Password Page
route.get('/change-password', passport.checkAuthIsDone, changePasswordPage);
route.post('/change-password', passport.checkAuthIsDone, changePassword);

// Verify Email
route.post('/verify-email', passport.checkAuthIsNotDone, verifyEmail);

// OTP Page
route.get('/otppage', passport.checkAuthIsNotDone, OTPPage);
route.post('/otpverify', passport.checkAuthIsNotDone, OTPVerify);

// New Password Page
route.get('/newPasswordPage', passport.checkAuthIsNotDone, newPasswordPage);
route.post('/changeNewPassword', passport.checkAuthIsNotDone, changeNewPassword);

// Profile Page
route.get('/profile', passport.checkAuthIsDone, profilePage);

// Dashboard Page
route.get('/dashboard', passport.checkAuthIsDone, dashboardPage);

// Add Admin Page
route.get('/addAdminPage', passport.checkAuthIsDone, addAdminPage);

// View Admin Page
route.get('/viewAdminPage', passport.checkAuthIsDone, viewAdminPage);

// Insert Admin
route.post('/insertAdmin', passport.checkAuthIsDone, upload.single('profile_image'), insertAdmin);

// Delete Admin
route.get('/deleteAdmin', passport.checkAuthIsDone, deleteAdmin);

// Edit Admin Page
route.get('/editAdmin/:adminId', passport.checkAuthIsDone, editAdminPage);

// Update Admin
route.post('/editAdmin/:adminId', passport.checkAuthIsDone, upload.single('profile_image'), updateAdmin);

module.exports = route;