const mongoose= require("mongoose")

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Coupon name is required'],
        unique:[true,'Coupon must be unique'],
    },
    expire:{
        type:String,
        required:[true,'Coupon expire time required'],
    },
    discount:{
        type:Number,
        required:[true,'Coupon discount value required'],
    },
    numCouponUsege:Number,
    
},{timestamps:true})

module.exports=new mongoose.model('Coupon',couponSchema)