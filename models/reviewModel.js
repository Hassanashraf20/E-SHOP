const mongoose= require("mongoose")

const Product = require('./productModel')


const reviewSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    ratings:{
        type:Number,
        required:[true,'ratings required '],
        min:[1,'min ratings value must be 1.0'],
        max:[5,'max ratings value must be 5.0'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel',
        required:[true,'Review must belong to user'],
    },
    // parent reference (one to many)
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'productModel',
        required:[true,'Review must belong to product'],
    },
},{timestamps:true})


// Mongoose query middleware
// populate user on Review
reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user', select:'name profilePhoto'})
    next() 
})



//aggregation 
reviewSchema.statics.calcRatAvaregeAndQuantity= async function(productId){
const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    { $match: 
        { product: productId } 
    },
    // Stage 2: Grouping reviews based on productID and calc {$avg} avgRatings, {$sum} ratingsQuantity
    { $group:
         { _id: "product" , avgRatings:{ $avg:'$ratings' }, ratingsQuantity:{ $sum:1 } }
    },
])

if(result.length > 0 ){
    await Product.findByIdAndUpdate(productId, {
        ratingAvarege:result[0].avgRatings,
        ratingQuantity:result[0].ratingsQuantity,
    })
}else {
    await Product.findByIdAndUpdate(productId, {
        ratingAvarege: 0,
        ratingQuantity: 0,
    })
  }

}

reviewSchema.post('save',async function(){
  await  this.constructor.calcRatAvaregeAndQuantity(this.product)
})

// reviewSchema.post('remove',async function(){
//     await  this.constructor.calcRatAvaregeAndQuantity(this.product)
// })
  


const reviewModel= new mongoose.model('review',reviewSchema)

module.exports=reviewModel