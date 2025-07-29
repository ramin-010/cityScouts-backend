const User = require('../models/User')
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios')


// @desc  Register User
//@route  POST/api/auth/register
// @access Public
const emailCheck = async (email) => {
    try {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.Email_Validate_Api}&email=${email}`
      );
  
      const data = response.data;
  
      const result =
        data.deliverability === "DELIVERABLE" &&
        data.is_valid_format?.value &&
        data.is_mx_found?.value &&
        data.is_smtp_valid?.value;
  
      return result;
    } catch (err) {
      return false;
    }
  };
  

const register = async (req, res, next) => { 
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            throw new ErrorResponse(400,'Missing Credentials' )
        }

        const isVerified = await emailCheck(email);
        if(!isVerified){
            throw new ErrorResponse(500, "Please enter a valid email address")
        }

        const userExist = await User.findOne({email});

        if(userExist){
            throw new ErrorResponse(400,'User already exist')
        }
        console.log('create user')
        const user = await User.create({
            name, 
            email,
            password,
        });
        sendTokenResponse(user, 201, res);

    }catch(err){
        next(err);
    }
}

// @desc   User login
//@route  POST/api/auth/login
// @access Public
const login = async(req , res, next)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            throw new ErrorResponse(400,'Please provide the required credentials' );
        }
        const user = await User.findOne({email}).select('+password');

        if(!user){
            throw new ErrorResponse('User does not exist, Please SignUp first', 401);
        } 
        const isMatchPass = await user.matchPassword(password);

        if(!isMatchPass){
            throw new ErrorResponse('Invalid Credentials', 401)
        }

        sendTokenResponse(user, 201, res);

    }catch(err){
        next(err);
    }
}


// @desc  current logged in user
//@route  POST/api/auth/authmiddleware/me
// @access private

const getMe = async(req , res, next)=>{
    try{   
    
        const user = await User.findById(req.user._id)
            .populate({
                path : 'favourites.attractions',
                select : 'name category location rating mainImage'
            })
            .populate({
                path : 'favourites.dinings',
                select : 'name category location rating mainImage'
            })
            .populate({
                path : 'favourites.events',
                select : 'name category location rating mainImage'
            })
            .lean();
     
        res.status(200).json({
            success: true,
            data: user
        });
    }catch(err){
        next(err);
    }
}

// @desc  logout
//@route  POST/api/auth/logout
// @access private
const logout = async(req, res)=>{
    res.cookie('token', 'none', {
        expires: new Date(Date.now()+ 10 * 1000),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: 'Successfully logged out',
        data: {}
    })
}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const option = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,          
        sameSite: 'None'        
    };

    user.password = undefined;

    res
        .status(statusCode)
        .cookie('token', token, option)
        .json({
            success: true,
            data: user,
        });
};



module.exports = {
    register,
    login,
    getMe,
    logout
}