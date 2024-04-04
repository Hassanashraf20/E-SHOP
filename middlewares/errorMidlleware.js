const apiError = require("../utils/apiError")


    const sendErrorFordev= (err,res)=>{
            return  res.status(err.statusCode).json({
             status:err.status,
             Error:err,
             massage:err.massage,
             stack:err.stack
    
            })

    
     }


    const sendErrorForprod= (err,res)=>{
        return  res.status(err.statusCode).json({
            status:err.status,
            massage:err.massage
            
            
    
        })
    }

const handleJwtInvalidSignature = () =>
    new apiError('Invalid token, please login again..', 401)
  
const handleJwtExpired = () =>
    new apiError('Expired token, please login again..', 401)


const globaleError = (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.status=err.status  || "Error"

        if(process.env.NODE_ENV == 'development'){
            sendErrorFordev(err,res)
        }else {
            if(err.name=='JsonWebTokenError') err=handleJwtInvalidSignature()
            if(err.name=='TokenExpiredError') err=handleJwtExpired()
            
            sendErrorForprod(err,res)
        }
    }



    module.exports = globaleError