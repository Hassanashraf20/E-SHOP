const asyncHandler = require('express-async-handler')
const apiError = require('../utils/apiError')



const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')



// Calculate total cart price
const calcTotalCartPrice = (cart)=>{
    let totalPrice = 0
    cart.cartItems.forEach((item)=>{
        totalPrice += item.quantity * item.price
    })
    cart.totalCartPrice = totalPrice
    cart.totalPriceAfterDiscount = undefined

    return totalPrice
    
}



// @desc    Add product to Cart
// @route   POST /api/cart
// @access  Privte/User
exports.addToCart=asyncHandler(async(req,res,next)=>{
    const {productId,color}=req.body
    const product = await Product.findById(productId)
    // Get Cart for logged user
    let cart = await Cart.findOne({user:req.user._id})

    if(!cart){
        // create cart for logged user with product
        cart = await Cart.create({
            user: req.user._id , cartItems: [{product: productId , color , price: product.price }],
        })    
    }else{
        // product exist in cart, update product quantity
        const productIndex = cart.cartItems.findIndex(
            (item)=> item.product.toString() === productId && item.color === color)

        if(productIndex >-1 ){
            const cartItem = cart.cartItems[productIndex]
            cartItem.quantity += 1 

            cart.cartItems[productIndex] = cartItem
        }else{
            // product not exist in cart,  push product to cartItems array
            cart.cartItems.push({product: productId , price: product.price , color})
        }
    }

    // Calculate total cart price
    calcTotalCartPrice(cart)


    await cart.save()

    res.status(200).json(
        {status:'success🚀',
        message:'Product added to cart successfully' , numItems:cart.cartItems.length , data:cart}
    )
})




// @desc    Get logged user cart
// @route   GET /api/cart
// @access  Privte/User
exports.getLoggedUserCart=asyncHandler(async(req,res,next)=>{
    const cart = await Cart.findOne({ user:req.user._id })

    if(!cart){
        return next(new apiError(`There is no cart for this user id : ${req.user._id}`,404))
    }
    calcTotalCartPrice(cart)
    
    res.status(200).json({status:'success', numItems:cart.cartItems.length , data:cart})
})



// @desc    Remove specific cart item
// @route   DELETE /api/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem =asyncHandler(async(req,res,next)=>{
    const cart = await Cart.findOneAndUpdate({ user:req.user._id } , 
    {
        $pull: {cartItems: { _id: req.params.itemId }}
    },
       {new:true})

    if(!cart){
        return next(new apiError(`There is no cart for this user id : ${req.user._id}`,404))
    }
    calcTotalCartPrice(cart)

    res.status(200).json({status:'success',
        message:'Product Removed from cart successfully!' , numItems:cart.cartItems.length , data:cart})
})

// @desc    clear logged user cart
// @route   DELETE /api/cart
// @access  Private/User
exports.clearCart=asyncHandler(async(req,res,next)=>{
 await Cart.findOneAndDelete({ user:req.user._id })

    res.status(204).json({message:'All Cart clear successfully!' })
})



// @desc    Update specific cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) =>{
    const {quantity}= req.body
    const cart = await Cart.findOneAndUpdate({ user:req.user._id })
        if(!cart){
            return next(new apiError(`There is no cart for this user id : ${req.user._id}`,404))
        }
        // product exist in cart, update product quantity
        const itemIndex = cart.cartItems.findIndex(
        (item)=> item._id.toString() === req.params.itemId )
        
        if(itemIndex >-1 ){
            const cartItem = cart.cartItems[itemIndex]
            cartItem.quantity = quantity

            cart.cartItems[itemIndex] = cartItem
        }else{
            return next(
            new apiError(`there is no item for this id :${req.params.itemId}`, 404))
        }

        calcTotalCartPrice(cart)

        await cart.save()

    res.status(200).json({status:'success',
        message:'Product Quantity Updated on cart successfully!' , numItems:cart.cartItems.length , data:cart})
})


// @desc    Apply coupon on logged user cart
// @route   PUT /api/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) =>{
    // 1) Get coupon based on coupon name
    const coupon = await Coupon.findOne({ name:req.body.coupon , expire: { $gt : Date.now() } })

    if(!coupon){
        return next(new apiError('Coupon :'+ req.body.coupon +' is invalid or expired',404))
    }
    // 2) Get logged user cart to get total cart price
    const cart = await Cart.findOne({ user:req.user._id })
    const totalCartPrice = cart.totalCartPrice

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (totalCartPrice - ( totalCartPrice * coupon.discount) / 100).toFixed(2)
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount

    //4) ruducing NUM Of Coupon Usege
    let numCouponUsege = coupon.numCouponUsege
    if(coupon.numCouponUsege > 0 ){
        numCouponUsege -= 1
        coupon.numCouponUsege = numCouponUsege
    }else{
        return next(new apiError('Coupon :'+ req.body.coupon +' is invalid or expired or Sold out',404))
    }


    await cart.save()
    await coupon.save()
    res.status(200).json({status:'success',
        message:'Coupon Applied successfully!' ,
        numItems:cart.cartItems.length , data:cart})
})


