const asyncHandler = require('express-async-handler')


const userModel = require('../models/userModel')


// @desc    Add Address To user addresses list
// @route   POST /api/address
// @access  auth/User
exports.addAddress=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        // $addToSet => add address object to user addresses  array if address not exist
        $addToSet:{addresses:req.body}
    },
    {new:true})

    res.status(200).json({status:'success',
    massage:'Address added successfully.',
    data:user.addresses})
})




// @desc    Remove address from user addresses list
// @route   DELETE /api/addresses
// @access  auth/User
exports.RemoveAddressFromaddresses=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        // $pull => add address object to user addresses  array if address not exist
        $pull:{addresses:{ _id: req.params.addressId}}
    },
    {new:true})

    res.status(200).json({status:'success',
    massage:'Address removed successfully.',
    data:user.addresses})
})


// @desc    Remove All Address From addresses
// @route   DELETE /api/addresses
// @access  auth/User
exports.RemoveAllAddressFromaddresses=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        $pullAll:{addresses:req.user.addresses}
    },
    {new:true})

    res.status(204).json({status:'success',
    massage:'All Address removed successfully.',
    data:user.addresses})
})





// @desc    Get logged user addresses list
// @route   GET /api/addresses
// @access  auth/User
exports.getLoggedUseraddresses=asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.user._id).populate('addresses')

    res.status(200).json({status:'success',results:user.addresses.length,data:user.addresses})
})





// // @desc    Update Address To user addresses list
// // @route   UPDATE /api/address
// // @access  auth/User
// exports.updateAddress=asyncHandler(async(req,res)=>{
//     const user = await userModel.findByIdAndUpdate(req.user._id,
//     {
//          $addToSet:{addresses:req.body}
//     },
//     {new:true})

//     res.status(200).json({status:'success',
//     massage:'Address Updated successfully.',
//     data:user.addresses})
// })
