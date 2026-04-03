const moment = require("moment")
const bcrypt = require("bcrypt")
const status = require("http-status-code")
const jwt = require("jsonwebtoken")
const { successResponse, errorResponse } = require("../../../utils/response.utils");
const AuthAdmin = require("../../../services/auth/admin/admin.service");
const { MSG } = require("../../../utils/msg");
const Admin = require("../../../model/admin.model")
const { sendOTPMail } = require("../../../utils/mailer");


const adminAuth = new AuthAdmin();

module.exports.registerAdmin = async (req,res) => {
    try{
        console.log("Admin registration req.body:", JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json(errorResponse(400, true, "Email and password are required"))
        }

        const admin = await adminAuth.fetchSingleAdmin({email : req.body.email , isDelete : false})
        if (admin) {
            return res.status(400).json(errorResponse(400,true, MSG.ADMIN_ALREADY_EXIST))
        }

        req.body.password = await bcrypt.hash(req.body.password, 11)
        req.body.created_at = moment().format('MMMM Do YYYY, h:mm:ss A');
        req.body.updated_at = moment().format('MMMM Do YYYY, h:mm:ss A');

        const newAdmin = await adminAuth.registerAdmin(req.body)
        if (!newAdmin) {
            return res.status(400).json(errorResponse(400, true, MSG.ADMIN_REGISTRATION_FAILED))
        }

        console.log("New admin created:", newAdmin.email)
        return res.status(201).json(successResponse(201, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin))
        
    }catch(err){
        console.log("Admin registration error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.loginAdmin = async (req,res) => {
    try{
        const admin = await adminAuth.fetchSingleAdmin({email : req.body.email , isDelete : false})
        if (!admin) {
            return res.status(400).json(errorResponse(400,true, MSG.ADMIN_NOT_FOUND))
        }

        //checking password
        const isPassword = await bcrypt.compare(req.body.password, admin.password)

        if (!isPassword) {
            return res.status(400).json(errorResponse(400,true, MSG.ADMIN_INVALID_PASSWORD))
        }

        let payload = {
            admin_id : admin._id,
            isAdmin: true
        }

        // generating token using jwt
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        console.log("Generated admin token:", token);
        
        
        
        return res.status(200).json(successResponse(200,false, MSG.ADMIN_LOGIN_SUCCESS, {token}))

    }catch(err){
        console.log("Admin login error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.fetchAllAdmins = async (req,res) => {
    try{
        console.log("Fetch all admins request");
        
        const allAdmins = await adminAuth.fetchAllAdmin();
        console.log("Admins fetched:", allAdmins?.length);

        return res.status(200).json(successResponse(200,false, MSG.ALL_ADMIN_FETCHED_SUCCESSFULLY, allAdmins))
    }catch(err){
        console.log("Fetch all admins error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.forgotPassword = async (req,res) => {
    try{
        console.log("Admin forgot password req.body:", req.body);
        
        const admin = await adminAuth.fetchSingleAdmin({email: req.body.email , isDelete : false})
        console.log("Found admin:", admin ? "YES" : "NO");

        if (!admin) {
            return res.status(404).json(errorResponse(404,true,MSG.ADMIN_NOT_FOUND))
        }

        if (admin.attempt_expire < Date.now()) {
            await adminAuth.updateAdmin(admin._id, { attempt: 0 });
            admin.attempt = 0;
            console.log("Reset admin attempts to 0");
        }

        if (admin.attempt >= 3) {
            return res.status(429).json(errorResponse(429,true,MSG.MANY_TIME_OTP))
        }

        const OTP = Math.floor(100000 + Math.random() * 900000)
        console.log("Generated admin OTP:", OTP);
        
        await sendOTPMail(req.body.email, OTP)
        console.log("Admin email sent successfully");

        admin.attempt++;
        const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2)

        await adminAuth.updateAdmin(admin._id, { 
            OTP: OTP, 
            OTP_Expire: expireOTPTime, 
            attempt: admin.attempt, 
            attempt_expire: new Date(Date.now() + 1000 * 60 * 60) 
        })
        console.log("Admin updated with OTP");

        return res.status(200).json(successResponse(200, false, MSG.OTP_SEND))

    }catch(err){
        console.log("Admin forgot password error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.verifyOTP = async (req,res) => {
    try{
        console.log("Admin verify OTP req.body:", req.body);
        
        if (!req.body || !req.body.email || !req.body.OTP) {
            return res.status(400).json(errorResponse(400, true, "Email and OTP are required"));
        }
        
        const admin = await adminAuth.fetchSingleAdmin({email : req.body.email , isDelete : false});
        console.log("Found admin:", admin ? "YES" : "NO");
        
        if (!admin) {
            return res.status(404).json(errorResponse(404, true, MSG.ADMIN_NOT_FOUND))
        }
        
        console.log("Admin OTP:", admin.OTP);
        console.log("Request OTP:", req.body.OTP);
        console.log("OTP Expire:", admin.OTP_Expire);
        console.log("Current Time:", Date.now());
        console.log("Is Expired:", admin.OTP_Expire < Date.now());
        
        if (admin.OTP_Expire < Date.now()) {
            return res.status(400).json(errorResponse(400, true, MSG.OTP_EXPIRED))
        }

        if (req.body.OTP != admin.OTP) {
            return res.status(400).json(errorResponse(400, true, MSG.INVALID_OTP))    
        }

        await adminAuth.updateAdmin(admin._id, {
            OTP: null,
            OTP_Expire: null,
            attempt: 0,
            attempt_expire: null
        });

        return res.status(200).json(successResponse(200, false, MSG.VERIFY_OTP, { email: admin.email }));
        
    }catch(err){
        console.log("Admin verify OTP error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.changePassword = async (req,res) => {
    try{
        console.log("Change password req.body:", req.body);
        
        const admin = await adminAuth.fetchSingleAdmin({email : req.body.email, isDelete : false});
        if(!admin){
            return res.status(404).json(errorResponse(404,true,"Admin not found with this email"))
        }
        console.log("Admin found:", admin._id);
        
        const hashedPassword = await bcrypt.hash(req.body.password, 11);
        console.log("Password hashed");
        
        await adminAuth.updateAdmin(admin._id, {password: hashedPassword})
        console.log("Password updated");
        
        return res.status(200).json(successResponse(200, false, MSG.PASSWORD_CHANGE_SUCCESS))
    }catch(err){
        console.log("Change password error:", err.message);
        return res.status(500).json(errorResponse(500, true, err.message));
    }
}

module.exports.deleteAdmin = async (req,res) => {
    try{
        console.log("Delete admin req query:", req.query);
        
        const admin = await adminAuth.fetchSingleAdmin( {_id : req.query.id, isDelete : false})
        console.log("Admin found:", admin ? "YES" : "NO");
        
        if (!admin) {
            return res.status(404).json(errorResponse(404,true,MSG.ADMIN_NOT_FOUND))
        }
        
        await adminAuth.deleteAdmin(admin._id)
        console.log("Admin deleted successfully");

        return res.status(200).json(successResponse(200, false, MSG.ADMIN_DELETED_SUCCESSFULLY))
    }catch(err){
        console.log("Delete admin error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.activeOrInactiveAdmin = async (req,res) => {
    try{
        console.log("Active/Inactive admin req.query:", req.query);
        
        const admin = await adminAuth.fetchSingleAdmin({_id : req.query.id, isDelete : false})
        if (!admin) {
            return res.status(404).json(errorResponse(404, true, MSG.ADMIN_NOT_FOUND))
        }
       
        const updatedAdmin = await adminAuth.updateAdmin(admin._id, {isActive : !admin.isActive})
        return res.status(200).json(successResponse(200, false, `Admin ${admin.first_name} ${admin.last_name} is ${updatedAdmin.isActive ? 'active' : 'inactive'}`))
    }catch(err){
        console.log("Active/Inactive admin error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.adminProfile = async (req,res) => {
    try{
        console.log("Admin profile request");
        
        if (!req.admin) {
            return res.status(401).json(errorResponse(401, true, MSG.ADMIN_UNAUTHORIZED));
        }
        
        return res.status(200).json(successResponse(200, false, MSG.ADMIN_PROFILE_FETCHED, req.admin))
    }catch(err){
        console.log("Admin profile error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}