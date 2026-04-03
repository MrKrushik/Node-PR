const User = require("../../../model/user.model");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response.utils");




module.exports = class AuthUser{
    async registerUser(body){
        try{
            return await User.create(body);
        }catch(err){
            console.log("User Registration Error ", err);
            throw err;
        }
        
    }
   
    async fetchSingleUser(body){
        try{
            return await User.findOne(body)
        }catch(err){
            console.log("Fetch Single User Error ", err);
            throw err;
        } 
    }

    async fetchAllUser(){
        try{
            return await User.find()
        }catch(err){
            console.log("Fetch All User Error ", err);
            throw err;
        } 
    }

    async updateUser(id,body){
        try{
            return await User.findByIdAndUpdate(id, body, {returnDocument: 'after'})
        }catch(err){
            console.log("Update User Error ", err);
            throw err;
        } 
    }

    async deleteUser(id){
        try{
            return await User.findByIdAndUpdate(id, {isDelete: true, isActive: false}, {returnDocument: 'after'})
        }catch(err){
            console.log("User delete error ", err);
            throw err;
        } 
    }
}