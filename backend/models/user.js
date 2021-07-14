const mongoose =require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxLenght:[30,'Your name cannot exeed 30 charcters']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'Please enter valid email adress'],
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[6,'Your password must be longer than 6 charcter'],
        select:false
       
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpired:Date,
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
})
//return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

//compare password
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//generate password reset token
userSchema.methods.getResetPasswordToken =  function(){
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hash and set  to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expire time

    this.resetPasswordExpired = Date.now() + 30 * 60 * 1000

    return resetToken;
}


module.exports = mongoose.model('User',userSchema)