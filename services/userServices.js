const asyncHandler = require('express-async-handler')
const apiError = require('../utils/apiError')

const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')


const userModel = require('../models/userModel')
const factoryHandler=require("./handlerFactory")
const {uploadSingleImage} = require("../middlewares/uploadImageMidlleware")
const createToken = require('../utils/createToken')


//@desc upload SingleImage
exports.uploadUserImage= uploadSingleImage('profilePhoto')




// Image processing
exports.resizeprofilePhoto = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
    if(req.file){
    await sharp(req.file.buffer)
      .resize(600,600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/Users/${filename}`)
  
    // Save image into our db 
     req.body.profilePhoto = filename
    }
    next()
  })



//@desc createUsers
//@route POST api/Users
//@accses privte/admin
exports.createUsers=factoryHandler.createOne(userModel)

//@desc Get list of Users
//@route GET api/v1/Users
//@accses privte/admin
exports.getUsers=factoryHandler.getAll(userModel)

//@desc Get Spacific user
//@route GET api/users/:id
//@accses privte/admin
exports.getUser=factoryHandler.getOne(userModel)

//@desc UpdateUser
//@route PUT api/Users/:id
//@accses privte/admin
exports.updateUser=asyncHandler(async(req,res,next)=>{
  const document=await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name:req.body.name,
        slug:req.body.slug,
        email:req.body.email,
        profilePhoto:req.body.profilePhoto,
        phone:req.body.phone,
        role:req.body.role,
      },
      {new:true},
  )
  if(!document){
      return next(new apiError(`document not found for this: ${req.params.id}`,404))
  }
  document.save()
  res.status(200).json({data:document})
})


exports.changeUserPassword=asyncHandler(async(req,res,next)=>{
  const document=await userModel.findByIdAndUpdate(
      req.params.id,
      {
      
        password:await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {new:true},
  )
  if(!document){
      return next(new apiError(`document not found for this: ${req.params.id}`,404))
  }
  document.save()
  res.status(200).json({data:document})
})

//@desc DeleteUsers
//@route DELETE api/Users/:id
//@accses privte/admin
exports.deleteUser=factoryHandler.deleteOne(userModel)




//@desc Get Logged user
//@route GET api/users/getMe
//@accses privte/auth
exports.getLoggedUser=asyncHandler(async(req,res,next)=>{
  req.params.id = req.user._id
  next()
})



// @desc    Update logged user password
// @route   PUT /api/users/changeMyPassword
// @access  Private/auth
exports.updateLoggedUserPassword=asyncHandler(async(req,res,next)=>{
  // 1) Update user password based user payload (req.user._id)
  const user =await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password:await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {new:true},
)
// 2) Generate token
const token = createToken(user._id)

res.status(200).json({data:user,token})

})



// @desc    Update logged user Date {waithout password , role }
// @route   PUT /api/users/updateMe
// @access  Private/auth
exports.updateLoggedUserData=asyncHandler(async(req,res,next)=>{
  const updatedUser =await userModel.findByIdAndUpdate(req.user._id,{
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    profilePhoto:req.body.profilePhoto,
  },
  {new:true})

  res.status(200).json({data:updatedUser})
})



// @desc    Update logged user Date {waithout password , role }
// @route   DELETE /api/users/deactivateMe
// @access  Private/auth
exports.deactivateLoggedUser=asyncHandler(async(req,res,next)=>{
  await userModel.findByIdAndUpdate(req.user._id,{ active:false })

  res.status(204).json({massage:"Success deactivate"})
})