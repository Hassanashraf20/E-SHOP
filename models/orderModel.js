const mongoose= require("mongoose")

const orderSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel',
        required: [true, 'Order must be belong to user'],
    },
    cartItems:[
        {
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'productModel'
            },
            quantity:Number,
            color:String,
            price:Number,
        }
    ],
    taxPrice:{
        type:Number,
        default: 0 ,
    },
    shippingPrice:{
        type:Number,
        default: 0 ,
    },
    shippingAddress:{
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    totalorderPrice:Number,
    paymentMethod:{
        type:String,
        enum:['cash','card'],
        default:'cash',
    },
    isPaid:{
        type:Boolean,
        default:false,
    },
    paidAt:Date,

    isDeliverd:{
        type:Boolean,
        default:false,
    },
    deliverdAt:Date,

},{timestamps:true})


orderSchema.pre(/^find/ , function (next){
    this.populate({path:'user' , select:'name phone profilePhoto'})
//.this.populate({path:'cartItems.product' , select:'title imageCover'})
    next()
})

orderSchema.pre(/^find/ , function (next){
this.populate({path:'cartItems.product' , select:'title imageCover'})
    next()
})


module.exports = mongoose.model('Order',orderSchema)