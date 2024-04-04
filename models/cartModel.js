const mongoose= require("mongoose")

const cartSchema = new mongoose.Schema({
    cartItems:[
        {
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'productModel'
            },
            quantity:{
                type:Number,
                default:1,
            },
            color:String,
            price:Number,

        }
    ],
    totalCartPrice:Number,
    totalPriceAfterDiscount:Number,

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel'
    }
},{timestamps:true})



module.exports = mongoose.model('Cart',cartSchema)