const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./catchAsyncError');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

//checks if user  is authenticated  or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    
        const { token } = req.cookies;

        if(!token){
            return next(new ErrorHandler('Login first to access this resource',401))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await  User.findById(decoded.id);

        next()
})

exports.authorizeRoles = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(  new ErrorHandler(`Role  (${req.user.role}) is not allow the access this resource`,403))
        }
        next();
    }
}