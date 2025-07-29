const ErrorResponse = require('../utils/errorResponse');
const {uploadToCloud, deleteFromCloud} = require('../utils/uploadImage');
const User = require('../models/User');
const {getOne, adminGetAll,adminGetOne, createOne, updateOne, hardDeleteOne, softDeletOne} = require('../utils/crudFactory')


const updateProfile = async(req, res, next) =>{  //left
    try{
        const {name , email, password} = req.body;   
        const user = await User.findById(req.params.id).select('+password');

        if (name) {
            if (name === user.name) {
                throw new ErrorResponse(400, 'Name is same as before');
            }
            user.name = name;
        }
      
          // Email
        if (email) {
            if (email === user.email) {
                    throw new ErrorResponse(400, 'Email is same as before');
            }
            user.email = email;
        }

        if(password){
            const isSame = await user.matchPassword(password);
            if(isSame){
                throw new ErrorResponse(400, 'Password is same as before')
            }else{
                user.password = password
            }
        }
        if(req.file){
            user.photoURL = await uploadToCloud(req.file.buffer, 'user_profiles');
        }

        await user.save();

        res.status(200).json({
            success: true,
            data : user
        })
    }catch(err){
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(e => e.message);

            next(new ErrorResponse(message.join(', '), 400))
        }else{
            next(err);
        }
    }
}

const getUser = async(req, res, next) =>{
    try{

    }catch{
        
    }
}

const setUserRole = async(req, res, next) =>{
    try{
        const {userId} = req.params;
        const {role}  = req.body;

        const user = await User.findById(userId);
        console.log("this is", user)
        if(!user){
            throw new ErrorResponse(404, "User not found")
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success : true,
            message : `User role is set to ${role}`,
            data : user
        })
    }catch(err){
        next(err)
    }
} 


const addFavorite = async(req, res, next) =>{
    try{
        const user = req.user
        const itemId = req.params.id;
        const {model} = req.body;

        if(!user.favourites[model]){
            throw new ErrorResponse(404, "Invalid favorite category");
        }

        if(!user.favourites[model].includes(itemId)){
            user.favourites[model].push(itemId);
        }
        await user.save();

        res.status(200).json({
            success : true,
            message : "Successfully added to the Favorites"
        })
    }catch(err){
        next(err)
    }
}

const deleteFavorites = async(req, res, next) =>{
    try{
        const user = req.user;
        const itemId = req.params.id;
        const {model} = req.body;

        if(!user.favourites[model]){
            throw new ErrorResponse(404, "Invalid favorite category")
        }

        if(user.favourites[model].includes(itemId)){
            user.favourites[model] = user.favourites[model].filter(id => id.toString() != itemId);
        }
        await user.save();

        res.status(200).json({
            success : true,
            message : "Successfully removed form the Favorites"
        })
    }catch(err){
        next(err)
    }
}

const adminGetUsers = adminGetAll(User);

module.exports = {updateProfile, adminGetUsers, setUserRole,addFavorite,deleteFavorites}