const ErrorHandler = require('../utils/errorHandler');


module.exports =(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:true,
            error:err,
            errMessage :err.message,
            stack : err.stack
        })
    }
    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}
        errorMessage = err.message;

        //wrong mongoose object ıd error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid : ${err.path}`
            error = new ErrorHandler(message,400)
        }
        //handle mongoose validation error
        if(err.name==='ValidationError'){
            const message =Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message,400)
        }
        //handle  mongoose duplicate error
        if(err.code===11000){
            const message = `Duplicate ${Object.values(err.keyValue)} entered`
            error = new ErrorHandler(message,400)
        }
        //handle wrong JWT error
        if(err.name==='JsonWebTokenError'){
            const message ='Json WEB Token is invalid. Try again!!'
            error = new ErrorHandler(message,400)
        }
         //handle expired JWT error
         if(err.name==='TokenExpiredError'){
            const message ='Json WEB Token is invalid. Try again!!'
            error = new ErrorHandler(message,400)
        }

        res.status(err.statusCode).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
    
}