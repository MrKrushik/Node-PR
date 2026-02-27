const Admin = require('../model/admin.model');
const fs = require('fs');
const nodemailer = require('nodemailer');

function sessionRemove(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log("Session destroy error:", err);
            return res.redirect('/dashboard');
        }
        return res.redirect('/');
    });
}

// Login Page
module.exports.loginPage = async (req, res) => {
    try {
        return res.render('auth/login');
    } catch (err) {
        console.log("Login Page Error:", err);
        return res.redirect('/');
    }
};

// Login Logic 
module.exports.checkLogin = async (req, res) => {
    try {
        return res.redirect('/dashboard');
    } catch (err) {
        console.log("Login Error:", err);
        return res.redirect('/');
    }
};

// Logout
module.exports.logout = (req, res) => {
    sessionRemove(req, res);
};

//CHANGE PASSWORD
module.exports.changePasswordPage = async (req, res) => {
    try {
        return res.render('auth/changePasswordPage');
    } catch (err) {
        console.log("Change Password Page Error:", err);
        return res.redirect('/');
    }
};

// Change Password
module.exports.changePassword = async (req, res) => {
    try {
        const admin = res.locals.admin;
        const { current_password, new_password, confirm_password } = req.body;

        if (current_password !== admin.password) {
            console.log("Current password mismatch");
            return res.redirect('/change-password');
        }

        if (new_password === admin.password) {
            console.log("New password same as old");
            return res.redirect('/change-password');
        }

        if (new_password !== confirm_password) {
            console.log("Confirm password mismatch");
            return res.redirect('/change-password');
        }

        const updated = await Admin.findByIdAndUpdate(
            admin._id,
            { password: new_password },
            { new: true }
        );

        if (updated) {
            console.log("Password changed successfully");
            sessionRemove(req, res);
        } else {
            return res.redirect('/dashboard');
        }

    } catch (err) {
        console.log("Change Password Error:", err);
        return res.redirect('/');
    }
};

//FORGOT PASSWORD (OTP)
module.exports.verifyEmail = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            console.log("Admin not found");
            return res.redirect('/');
        }

        // Send OTP

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "itzmekrushik90999@gmail.com",
                pass: "bsdqvpzecrjbkgtt"
            }
        });

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        const info = await transporter.sendMail({
            from: '"Admin Panel" <itzmekrushik90999@gmail.com>',

            to: req.body.email,
            subject: "OTP Verification",
            html: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
                <style>
                    /* Resets to ensure consistent rendering */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    
                    /* Mobile Styles */
                    @media screen and (max-width: 600px) {
                        .email-container { width: 100% !important; }
                        .otp-box { font-size: 32px !important; letter-spacing: 5px !important; }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000;">
                    <tr>
                        <td align="center" style="padding: 40px 10px;">
                            
                            <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="480" style="background-color: #191c24; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #2a3038;">
                                
                                <tr>
                                    <td height="4" style="background-color: #0090e7;"></td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding: 40px 40px 10px 40px;">
                                        <div style="width: 70px; height: 70px; background-color: rgba(0, 144, 231, 0.1); border-radius: 50%; display: inline-block; line-height: 70px; text-align: center; border: 1px solid rgba(0, 144, 231, 0.2);">
                                            <span style="font-size: 30px;">🛡️</span> 
                                        </div>
                                        
                                        <h2 style="color: #ffffff; font-size: 24px; margin: 20px 0 5px 0; font-weight: 600;">Verification Code</h2>
                                        <p style="color: #6c7293; font-size: 14px; margin: 0;">Request for Admin Access</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 20px 40px 40px 40px;">
                                        
                                        <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                                            Hi <strong>${admin.fname}</strong>,<br>
                                            Use the code below to complete your secure login.
                                        </p>

                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" style="background-color: #2a3038; border-radius: 12px; padding: 25px; border: 1px dashed #444;">
                                                    <span style="display: block; color: #6c7293; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">One-Time Password</span>
                                                    <span class="otp-box" style="display: block; color: #0090e7; font-size: 38px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                        ${OTP}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>

                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
                                            <tr>
                                                <td align="center">
                                                    <p style="color: #6c7293; font-size: 13px; margin: 0; display: inline-block; background-color: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 20px;">
                                                        ⏰ Code expires in <strong>10 minutes</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>

                                <tr>
                                    <td style="background-color: #0f1015; padding: 20px; text-align: center; border-top: 1px solid #2a3038;">
                                        <p style="color: #6c7293; font-size: 11px; margin: 0;">
                                            If you didn't request this, you can safely ignore this email.
                                        </p>
                                        <p style="color: #6c7293; font-size: 11px; margin: 5px 0 0 0;">
                                            © 2026 Admin Secure Access
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>

            </body>
            </html>`,
        });

        console.log(info.messageId);

        // store OTP and admin id in session instead of cookies
        req.session.OTP = OTP;
        req.session.adminId = admin.id;

        return res.redirect('/otppage'); // OTP Verify Page

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
};
// otp page
module.exports.OTPPage = (req, res) => {
    try {
        if (!req.session.OTP) return res.redirect('/');
        return res.render('auth/OTPPage');
    } catch (err) {
        console.log("OTP Page Error:", err);
        return res.redirect('/');
    }
};

// OTP Verify
module.exports.OTPVerify = async (req, res) => {
    try {
        console.log("User Side : ", req.body);
        console.log("Developer Side : session", req.session);

        if (req.body.adminOTP !== req.session.OTP) {
            console.log("OTP not match...");
            return res.redirect('/otppage');
        }

        return res.redirect('/newPasswordPage');

    } catch (err) {
        console.log("Something went wrong");
        console.log("Error : ", err);
        return res.redirect('/');
    }
};


// New Password Page
module.exports.newPasswordPage = (req, res) => {
    try {
        if (!req.session.adminId) return res.redirect('/');
        // remove OTP once user progresses
        delete req.session.OTP;
        return res.render('auth/newPasswordPage');
    } catch (err) {
        console.log("New Password Page Error:", err);
        return res.redirect('/');
    }
};

// Change New Password
module.exports.changeNewPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            console.log("Password mismatch");
            return res.redirect('/newPasswordPage');
        }

        await Admin.findByIdAndUpdate(req.session.adminId, {
            password: newPassword
        });

        // clear session values
        delete req.session.adminId;
        delete req.session.OTP;
        return res.redirect('/');

    } catch (err) {
        console.log("Change New Password Error:", err);
        return res.redirect('/');
    }
};

// Dashboard Page
module.exports.dashboardPage = async (req, res) => {
    try {
        return res.render('dashboard');
    } catch (err) {
        console.log("Dashboard Error:", err);
        return res.redirect('/');
    }
};

// Profile Page
module.exports.profilePage = async (req, res) => {
    try {
        return res.render('profile/profilePage');
    } catch (err) {
        console.log("Profile Error:", err);
        return res.redirect('/');
    }
};

// Add Admin Page
module.exports.addAdminPage = async (req, res) => {
    try {

        return res.render('addAdminPage');

    } catch (err) {
        console.log("Add Admin Page Error:", err);
        return res.redirect('/dashboard');
    }
};

// View Admin Page
module.exports.viewAdminPage = async (req, res) => {
    try {
        let allAdmin = await Admin.find();

        allAdmin = allAdmin.filter(a => a.email !== res.locals.admin.email);

        return res.render('viewAdminPage', {
            allAdmin,
        });

    } catch (err) {
        console.log("View Admin Error:", err);
        return res.redirect('/dashboard');
    }
};


// Insert Admin
module.exports.insertAdmin = async (req, res) => {
    try {
        req.body.profile_image = req.file.path;
        await Admin.create(req.body);
        return res.redirect('/addAdminPage');
    } catch (err) {
        console.log("Insert Admin Error:", err);
        return res.redirect('/addAdminPage');
    }
};

// Delete Admin
module.exports.deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.query.adminId);

        if (deleted && deleted.profile_image) {
            fs.unlink(deleted.profile_image, () => { });
        }

        return res.redirect('/viewAdminPage');
    } catch (err) {
        console.log("Delete Admin Error:", err);
        return res.redirect('/viewAdminPage');
    }
};

// Edit Admin Page
module.exports.editAdminPage = async (req, res) => {
    try {
        const singleAdmin = await Admin.findById(req.params.adminId);
        return res.render('editAdminPage', { singleAdmin });
    } catch (err) {
        console.log("Edit Admin Page Error:", err);
        return res.redirect('/viewAdminPage');
    }
};

// update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        if (req.file) {
            req.body.profile_image = req.file.path;
            const old = await Admin.findByIdAndUpdate(req.params.adminId, req.body);
            if (old && old.profile_image) fs.unlink(old.profile_image, () => { });
        } else {
            await Admin.findByIdAndUpdate(req.params.adminId, req.body);
        }

        return (req.params.adminId === res.locals.admin.id)
            ? res.redirect('/profile')
            : res.redirect('/viewAdminPage');

    } catch (err) {
        console.log("Update Admin Error:", err);
        return res.redirect('/viewAdminPage');
    }
};