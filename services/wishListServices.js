const asyncHandler = require('express-async-handler')


const userModel = require('../models/userModel')


// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  auth/User
exports.addProductToWishList=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        // $addToSet => add address object to user addresses  array if address not exist
        $addToSet:{wishList:req.body.productId}
    },
    {new:true})

    res.status(200).json({status:'success',
    massage:'Product added successfully to your wishlist.',
    data:user.wishList})
})




// @desc    Remove product From wishlist
// @route   DELETE /api/wishlist
// @access  auth/User
exports.RemoveProductFromWishList=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        // $pull => add address object to user addresses  array if address not exist
        $pull:{wishList:req.params.productId}
    },
    {new:true})

    res.status(200).json({status:'success',
    massage:'Product Removed successfully From your wishlist.',
    data:user.wishList})
})


// @desc    Remove All product From wishlist
// @route   DELETE /api/wishlist
// @access  auth/User
exports.RemoveAllProductFromWishList=asyncHandler(async(req,res)=>{
    const user = await userModel.findByIdAndUpdate(req.user._id,
    {
        $pullAll:{wishList:req.user.wishList}
    },
    {new:true})

    res.status(204).json({status:'success',
    massage:'All Products Removed successfully From your wishlist.',
    data:user.wishList})
})





// @desc    Get Logged User Wishlist
// @route   GET /api/wishlist
// @access  auth/User
exports.getLoggedUserWishlist=asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.user._id).populate('wishList')
    res.status(200).json({status:'success',results:user.wishList.length,data:user.wishList})
})