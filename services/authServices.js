const crypto = require('crypto')

const asyncHandler = require('express-async-handler')
const apiError = require('../utils/apiError')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userModel = require('../models/userModel')
const sendEmail = require('../utils/sendEmail')
const createToken = require('../utils/createToken')

// @desc    Signup
// @route   GET /api/auth/signup
// @access  Public
exports.signup=asyncHandler(async(req,res,next)=>{

    //1)create a new user
    const user=await userModel.create({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password,
    })

    //2)create token
    const token = createToken(user._id)


    res.status(201).json({data:user,token})

})


// @desc    Login
// @route   GET /api/auth/login
// @access  Public
exports.login=asyncHandler(async(req,res,next)=>{
    const user = await userModel.findOne({email:req.body.email})

    if(!user || !(await bcrypt.compare(req.body.password,user.password))){
        return next(new apiError('incorrect email or password',401))
    }

    //2)create token
    const token= createToken(user._id)

    res.status(200).json({data:user,token})
})


// @desc  {protect}   make sure the user is logged in
exports.auth=asyncHandler(async(req,res,next)=>{
    //1)check token is exist or not exist
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }  if (!token) {
        return next(
          new apiError(
            'You are not login, Please login to get access this route',401)
        )
    }

    //2)Verify token (no change happens, expired token)
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY)


    //3)check if user exist
    const currentUser= await userModel.findById(decoded.userId) 

    if(!currentUser){
        return next(new apiError('The user that belong to this token does no longer exist',401))
    }


  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000, 10)
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(new apiError('User recently changed his password. please login again..', 401))
    }
  }

  //5)Check if Active Logged Field is True 
  if(currentUser.active==false){
    return next(new apiError('User Deactivate , please activate it or contact with Admin', 401))
  }

req.user=currentUser
next()
})


// @desc    Authorization (User Permissions)
//["admin", "manager"]
exports.allowedTo=(...roles)=>asyncHandler(async(req,res,next)=>{
    // 1) access roles
    // 2) access registered user (req.user.role)
    if(!roles.includes(req.user.role)){
        return next(
          new apiError('You are not allowed to access this route', 403))
      }
    next()
})



// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
// @access  Public
exports.forgotPassword=asyncHandler(async(req,res,next)=>{
  //1)Get user by email
  const user = await userModel.findOne({email:req.body.email})
  if(!user){
    return next(
          new apiError(`There is no user with that email ${req.body.email}`, 404))
      }
  //2)Generate random 6-digits and save it into DB
  const resetCode=Math.floor(100000 + Math.random() * 900000).toString()
  const hashedResetCode=crypto
  .createHash('sha256')
  .update(resetCode)
  .digest('hex')

  //save hashed Reset Code into db
  user.passwordResetCode = hashedResetCode
   // Add expiration time for password reset code (5 min)
  user.passwordResetExpires = Date.now()+ 5 * 60 * 1000
  user.passwordResetVerified = false

  await user.save()

  //3)send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`
  try{
    sendEmail({
      email:user.email,
      subject:'Your password reset code (valid for 5 min)',
      message,
    })
  
  }catch(err){
    user.passwordResetCode= undefined
    user.passwordResetExpires= undefined
    user.passwordResetVerified= undefined

    await user.save()

    return next(new apiError('There is an error in sending email', 500))
  }

  res.status(200).json({status: 'Success', message: 'Reset code just sent to email'})

})



// @desc    Verify password reset code
// @route   POST /api/auth/verifyResetCode
// @access  Public
exports.verifyResetCode=asyncHandler(async(req,res,next)=>{
  //Get user by Reset Code 
  const hashedResetCode=crypto
  .createHash('sha256')
  .update(req.body.resetCode)
  .digest('hex')

  const user = await userModel.findOne({passwordResetCode : hashedResetCode , passwordResetExpires:{$gt:Date.now()} })

  if(!user){
    return next(new apiError('Reset code invalid or expired',404))
  }

  // 2) Reset code valid
  user.passwordResetVerified = true
  await user.save()

  res.status(200).json({status:'Success' , message:'password reset code is Verify'})


})



// @desc    Reset password
// @route   POST /api/auth/resetPassword
// @access  Public
exports.resetPassword=asyncHandler(async(req,res,next)=>{
    // 1) Get user based on email
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      return next(
        new apiError(`There is no user with email ${req.body.email}`, 404))
    }
    // 2) Check if reset code verified
    if(user.passwordResetVerified != true){
      return next(
        new apiError(`Reset code not verified :${user.passwordResetVerified}`, 400))
    }
  
    user.password=req.body.newPassword
    user.passwordResetCode= undefined
    user.passwordResetExpires= undefined
    user.passwordResetVerified= undefined
  
    await user.save()
  
    //3)Generate token
    const token = createToken(user._id)

  res.status(200).json({token})
  
})


