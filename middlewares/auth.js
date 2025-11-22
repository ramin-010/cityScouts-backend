const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken')

const authMiddleware = async(req, res , next) =>{
    let token;
   
    try{        
        console.log("form the auth middle ware", req.body)
        token = req.cookies?.token;
        if (!token) {
            console.log("No token found in cookies");
            throw new ErrorResponse(401, "Please login/Signup first")
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const id = decoded.id;
        const user = await User.findById(id);
        
        if(!user){
            throw new ErrorResponse(401, "User not found");
        }
        req.user = user 
        next();
    }catch(err){
        next(err);
    }
}


const isAdmin = async(req, res, next) =>{
    try{
        if(req.user.role === 'admin'){
            next();
        }else{
            throw new ErrorResponse(404, "You are not authorized for Admin roles")
        }
    }catch(err){
        next(err)
    }
}

const isContributor = (req, res, next) => {
    try {
        if (req.user.role === 'contributor' || req.user.role === 'admin') {
            next();
        } else {
            throw new ErrorResponse(403, "You are not authorized for this action. Requires admin or contributor role");
        }
    } catch (err) {
        next(err);
    }
}

const dashboardAccess = (req, res, next) =>{
    try{
        console.log("this is role", req.user.role)
       const allowRoles = ['admin', 'contributor', 'recruiter']
       const userRole = req.user.role
       if(allowRoles.includes(userRole)){
            next();
       }else{
            throw new ErrorResponse(404, "Unauthorized access");
       } 
    }catch(err){
        next(err)
    }
}


const DontAllowRecruiterToChangePass = (req, res, next) =>{
    console.log("this is the id in dd", req.params.id)
    console.log("this is req body", req.body)
   try{
    const user = req.user;
    if(user.role === 'recruiter'){
        throw new ErrorResponse(404, "Recruiter Profile Cannot be Modified")
    }
    next()
   }catch(err){
        next(err)
   }
}


module.exports = {authMiddleware, isAdmin, isContributor,dashboardAccess, DontAllowRecruiterToChangePass}