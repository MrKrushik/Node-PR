const Admin = require("../../../model/admin.model");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response.utils");




module.exports = class AuthAdmin{
    async registerAdmin(body){
        try{
            return await Admin.create(body);
        }catch(err){
            console.log("Admin Registration Error ", err);
            throw err;
        }
        
    }
   
    async fetchSingleAdmin(body){
        try{
            return await Admin.findOne(body)
        }catch(err){
            console.log("Fetch Single Admin Error ", err);
            throw err;
        } 
    }

    async fetchAllAdmin(){
        try{
            return await Admin.find()
        }catch(err){
            console.log("Fetch All Admin Error ", err);
            throw err;
        } 
    }

    async updateAdmin(id,body){
        try{
            return await Admin.findByIdAndUpdate(id, body, {returnDocument: 'after'})
        }catch(err){
            console.log("update admin error ", err);
            throw err;
        } 
    }

    async deleteAdmin(id){
        try{
            return await Admin.findByIdAndUpdate(id, {isDelete: true, isActive: false}, {returnDocument: 'after'})
        }catch(err){
            console.log("Admin delete error ", err);
            throw err;
        } 
    }
}