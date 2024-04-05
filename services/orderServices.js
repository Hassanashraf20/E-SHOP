const asyncHandler = require('express-async-handler')
const apiError = require('../utils/apiError')
const factoryHandler=require("./handlerFactory")



const stripe = require('stripe')(process.env.SECRET_KEY)



const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')





// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  auth/User
exports.createCashOrder = asyncHandler(async(req,res,next)=>{
    //app setting
    const taxPrice = 0
    const shippingPrice = 0
    //1)Get Cart from cartId
    const cart = await Cart.findById(req.params.cartId)
    if(!cart){
        return next(new apiError(`There is no such cart with id ${req.params.cartId}`,404))
    }
    //2)Get Order price from cart >|| totalCartPrice after check 'if coupon apply'
    let totalorderPrice
    if(cart.totalPriceAfterDiscount){
        totalorderPrice = cart.totalPriceAfterDiscount + taxPrice + shippingPrice
    }else{
        totalorderPrice = cart.totalCartPrice + taxPrice + shippingPrice
    }
    //3)Create Order with default payment method 'cash'
    const order = await Order.create({
        user:req.user._id ,
        cartItems: cart.cartItems ,
        shippingAddress: req.body.shippingAddress ,
        totalorderPrice: totalorderPrice ,
    })
    //4)After creating order, decrement (-) product quantity, increment (+) product sold  { Using bulkWrite }
    if(order){
        const bulkOpts = cart.cartItems.map((item)=>({
            updateOne:{
                filter:{_id : item.product} ,
                update:{$inc:{ quantity: -item.quantity , sold: +item.quantity }}
            }
        }))
        await Product.bulkWrite(bulkOpts,{})

        //5)Clear Cart depend on cartId
        await Cart.findByIdAndDelete(req.params.cartId)
    }

    res.status(200).json({status:'success' , data:order })
})


// limit user to get his order only
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) =>{
    if(req.user.role === 'user') {
        req.filterObj = { user: req.user._id }
    }
    next()
})

// @desc    Get all orders
// @route   POST /api/orders
// @access  auth/User-Admin-Manager
exports.getAllOrders = factoryHandler.getAll(Order)

// @desc    Get Specific order
// @route   Get /api/orders
// @access  auth/User-Admin-Manager
exports.findSpecificOrder = factoryHandler.getOne(Order)



// @desc    Update Cash order paid status to paid
// @route   PUT /api/orders/:id/pay
// @access  auth/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) =>{
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new apiError(`There is no such a order with this id:${req.params.id}`,404))
    }

    order.isPaid = true
    order.paidAt = Date.now()

   //const updatedOrder = 
   await order.save()

    res.status(200).json({status:'success' , data: order })
})


// @desc    Update Cash order Deliverd status to Deliverd
// @route   PUT /api/orders/:id/deliver
// @access  auth/Admin-Manager
exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) =>{
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new apiError(`There is no such a order with this id:${req.params.id}`,404))
    }

    order.isDeliverd = true
    order.deliverdAt = Date.now()

   const updatedOrder = await order.save()

    res.status(200).json({status:'success' , data: updatedOrder })
})



// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/orders/checkout-session/cartId
// @access  auth/User
exports.checkoutSession =  asyncHandler(async (req, res, next) =>{
  //app setting
    const taxPrice = 0
    const shippingPrice = 0

    //1)Get Cart from cartId
    const cart = await Cart.findById(req.params.cartId)
    if(!cart){
        return next(new apiError(`There is no such cart with id ${req.params.cartId}`, 404))
    }
    //2)Get Order price from cart >|| totalCartPrice after check 'if coupon apply'
    let totalorderPrice
    if(cart.totalPriceAfterDiscount){
        totalorderPrice = cart.totalPriceAfterDiscount + taxPrice + shippingPrice
    }else{
        totalorderPrice = cart.totalCartPrice + taxPrice + shippingPrice
    }

    //create stripe checkout-session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
              price_data: {
                currency: 'egp',
               // product:req.params.cartId,
                product_data: {
                  name: req.user.name,
                  description:'description',
                },
                unit_amount:totalorderPrice*100,
              },
              quantity: 1,
            },
          ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email:req.user.email,
        client_reference_id: req.params.cartId,
        metadata:req.body.shippingAddress,
      })

    res.status(200).json({status:'success' , session })
})


const createCardOrder =()=>{
    
}

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  auth/User
exports.webhookCheckout = asyncHandler(async (req, res, next) =>{
 const sig = req.headers['stripe-signature']

 let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET)
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the event
  if(event.type === 'checkout.session.completed'){
    //  Create order
    createCardOrder(event.data.object)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({received: true})
})