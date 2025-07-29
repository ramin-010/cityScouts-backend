const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email:{
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a Password'],
        minlength: 6,
        select: false
    },
    mainImage:{
        type: String,
        default: null
    },
    mainImagePublicId :{
        type : String ,
        default : ''
    },
    favourites:{
        attractions: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Attraction'
        }],
        dinings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dining'
        }],
        events: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }]
    },
    role:{
        type: String,
        enum : ['admin', 'user','recruiter', 'contributor'],
        default : 'user'
    }
},{
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
  }
);

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
       return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

UserSchema.methods.matchPassword = async function(enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
};


module.exports = mongoose.model('User', UserSchema);