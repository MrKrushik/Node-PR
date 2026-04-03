const moment = require("moment")
const bcrypt = require("bcrypt")
const status = require("http-status-code")
const jwt = require("jsonwebtoken")
const { successResponse, errorResponse } = require("../../../utils/response.utils");
const AuthUser = require("../../../services/auth/user/user.service");
const { MSG } = require("../../../utils/msg");
const User = require("../../../model/user.model")
const { sendOTPMail } = require("../../../utils/mailer");


const userAuth = new AuthUser();

module.exports.registerUser = async (req,res) => {
    try{
        console.log("User registration req.body:", JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json(errorResponse(400, true, "Email and password are required"))
        }

        const user = await userAuth.fetchSingleUser({email : req.body.email , isDelete : false})
        if (user) {
            return res.status(400).json(errorResponse(400,true, MSG.USER_ALREADY_EXISTS))
        }

        req.body.password = await bcrypt.hash(req.body.password, 11)
        req.body.created_at = moment().format('MMMM Do YYYY, h:mm:ss A');
        req.body.updated_at = moment().format('MMMM Do YYYY, h:mm:ss A');

        const newUser = await userAuth.registerUser(req.body)
        if (!newUser) {
            return res.status(400).json(errorResponse(400, true, MSG.USER_REGISTRATION_FAILED))
        }

        console.log("new USER ", newUser)
        return res.status(201).json(successResponse(201, false, MSG.USER_REGISTRATION_SUCCESS, newUser))
        
    }catch(err){
        console.log("User registration error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.loginUser = async (req,res) => {
    try{
        console.log("User login req.body:", req.body);

        const user = await userAuth.fetchSingleUser({email : req.body.email , isDelete : false})
        if (!user) {
            return res.status(400).json(errorResponse(400,true, MSG.USER_NOT_FOUND))
        }

        const isPassword = await bcrypt.compare(req.body.password, user.password)
        if (!isPassword) {
            return res.status(400).json(errorResponse(400,true, MSG.USER_INVALID_PASSWORD))
        }

        let payload = {
            user_id : user._id,
            isAdmin: false
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        console.log("Generated user token:", token);
        
        return res.status(200).json(successResponse(200,false, MSG.USER_LOGIN_SUCCESS, {token}))

    }catch(err){
        console.log("User login error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.fetchAllUsers = async (req,res) => {
    try{
        console.log("Fetch all users request");
        
        const allUsers = await userAuth.fetchAllUser();
        console.log("Users fetched:", allUsers?.length);

        return res.status(200).json(successResponse(200,false, MSG.USER_FETCH_SUCCESS, allUsers))
    }catch(err){
        console.log("Fetch all users error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.forgotPassword = async (req,res) => {
    try{
        console.log("Forgot password req.body:", req.body);
        
        const user = await userAuth.fetchSingleUser({email: req.body.email , isDelete : false})
        console.log("Found user:", user ? "YES" : "NO");
        
        if (!user) {
            return res.status(404).json(errorResponse(404,true,MSG.USER_NOT_FOUND))
        }

        console.log("User attempts:", user.attempt);
        console.log("Attempt expire:", user.attempt_expire);
        console.log("Current time:", Date.now());

        if (user.attempt_expire < Date.now()) {
            await userAuth.updateUser(user._id, { attempt: 0 });
            user.attempt = 0;
            console.log("Reset attempts to 0");
        }

        if (user.attempt >= 3) {
            return res.status(429).json(errorResponse(429,true,MSG.MANY_TIME_OTP))
        }

        const OTP = Math.floor(100000 + Math.random() * 900000)
        console.log("Generated OTP:", OTP);
        
        await sendOTPMail(req.body.email, OTP)
        console.log("Email sent successfully");

        user.attempt++;
        const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2)
        console.log("OTP will expire at:", expireOTPTime);

        await userAuth.updateUser(user._id, { 
            OTP: OTP, 
            OTP_Expire: expireOTPTime, 
            attempt: user.attempt, 
            attempt_expire: new Date(Date.now() + 1000 * 60 * 60) 
        })
        console.log("User updated with OTP");

        return res.status(200).json(successResponse(200, false, MSG.OTP_SEND))

    }catch(err){
        console.log("Forgot password error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.verifyOTP = async (req,res) => {
    try{
        console.log("Verify OTP req.body:", req.body);
        
        if (!req.body || !req.body.email || !req.body.OTP) {
            return res.status(400).json(errorResponse(400, true, "Email and OTP are required"));
        }
        
        const user = await userAuth.fetchSingleUser({email : req.body.email , isDelete : false});
        console.log("Found user:", user ? "YES" : "NO");
        
        if (!user) {
            return res.status(404).json(errorResponse(404, true, MSG.USER_NOT_FOUND))
        }
        
        console.log("User OTP:", user.OTP);
        console.log("Request OTP:", req.body.OTP);
        console.log("OTP Expire:", user.OTP_Expire);
        console.log("Current Time:", Date.now());
        console.log("Is Expired:", user.OTP_Expire < Date.now());
        
        if (user.OTP_Expire < Date.now()) {
            return res.status(400).json(errorResponse(400, true, MSG.OTP_EXPIRED))
        }

        if (req.body.OTP != user.OTP) {
            return res.status(400).json(errorResponse(400, true, MSG.INVALID_OTP))    
        }

        await userAuth.updateUser(user._id, {
            OTP: null,
            OTP_Expire: null,
            attempt: 0,
            attempt_expire: null
        });

        return res.status(200).json(successResponse(200, false, MSG.VERIFY_OTP, { email: user.email }));
        
    }catch(err){
        console.log("Verify OTP error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.changePassword = async (req,res) => {
    try{
        console.log("Change password req.body:", req.body);
        
        const user = await userAuth.fetchSingleUser({email : req.body.email, isDelete : false});
        if(!user){
            return res.status(404).json(errorResponse(404,true,MSG.USER_NOT_FOUND))
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 11);
        await userAuth.updateUser(user._id, {password: hashedPassword})
        
        return res.status(200).json(successResponse(200, false, MSG.USER_PASSWORD_CHANGED))
    }catch(err){
        console.log("Change password error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.deleteUser = async (req,res) => {
    try{
        console.log("Delete user req.query:", req.query);
        
        const user = await userAuth.fetchSingleUser( {_id : req.query.id, isDelete : false})
        if (!user) {
            return res.status(404).json(errorResponse(404,true,MSG.USER_NOT_FOUND))
        }
        
        await userAuth.deleteUser(user._id)
        return res.status(200).json(successResponse(200, false, MSG.USER_DELETE_SUCCESS))
    }catch(err){
        console.log("Delete user error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.activeOrInactiveUser = async (req,res) => {
    try{
        console.log("Active/Inactive user req.query:", req.query);
        
        const user = await userAuth.fetchSingleUser({_id : req.query.id, isDelete : false})
        if (!user) {
            return res.status(404).json(errorResponse(404, true, MSG.USER_NOT_FOUND))
        }
       
        const updatedUser = await userAuth.updateUser(user._id, {isActive : !user.isActive})
        return res.status(200).json(successResponse(200, false, `${user.first_name} ${user.last_name} is ${updatedUser.isActive ? 'active' : 'inactive'}`))
    }catch(err){
        console.log("Active/Inactive user error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}

module.exports.userProfile = async (req,res) => {
    try{
        console.log("User profile request");
        
        if (!req.user) {
            return res.status(401).json(errorResponse(401, true, MSG.USER_UNAUTHORIZED))
        }
        
        return res.status(200).json(successResponse(200, false, MSG.USER_PROFILE_FETCH_SUCCESS, req.user))
    }catch(err){
        console.log("User profile error:", err.message);
        return res.status(500).json(errorResponse(500, true, MSG.SERVER_ERROR))
    }
}