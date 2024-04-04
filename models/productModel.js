const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        require:[true,"Product must have title"],
        trim:true,
        minlength:[3,"too short product title "],
        maxlength:[300,"too long product title "],

    },slug:{
        type:String,
        require:true,
        lowercase:true,
    },description:{
        type:String,
        require:[true,"Product description is required"],
        minlength:[20,"too short product description "],
    },sold:{
       type:Number,
       default:0, 
    },quantity:{
        type:Number,
        require:[true,'product quantity is required']
    },price:{
        type:Number,
        require:[true,'product price is required'],
        trim:true,
        max:[200000,'too long product price']
    },priceAfterDiscount:{
        type:Number,
    },colors:[String],
    images:[String],
    imageCover:{
        type:String,
        require:[true,'product imageCover is required']
    },category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        require:[true,'product must be belong to Category' ],
    },subCategory:[{
        type:mongoose.Schema.ObjectId,
        ref:'subCategory'
    }],brands:{
        type:mongoose.Schema.ObjectId,
        ref:'brandsModel'
    },ratingAvarege:{
        type:Number,
        min:[1,'rating must be above or equale 1'],
        max:[5,'rating must be above or equale 5']
    },ratingQuantity:{
        type:Number,
        default:0,
    },

},{timestamps:true ,
    // to enable virtual populate
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
})

// virtual populate
productSchema.virtual('reviews',{
    ref: 'review',
    localField: '_id',
    foreignField: 'product'
})




// Mongoose query middleware
productSchema.pre(/^find/,function(next){
    this.populate({
        path:"category",
        select:"name"
    })
    next()
})
productSchema.pre(/^find/,function(next){
    this.populate({
        path:"subCategory",
        select:"name"
    })
    next()
})



//Add full Url to imageCover
const setImageURL=(doc)=>{
    if(doc.imageCover){
    const imageUrl=`${process.env.BASE_URL}/product/${doc.imageCover}`
    doc.imageCover=imageUrl
 }
 
//Add full Url to images
 if(doc.images){
    const imageList=[]
    doc.images.forEach((img)=>{
    const imageUrl=`${process.env.BASE_URL}/product/${img}`    
    imageList.push(imageUrl)
    })
    doc.images=imageList
 }
}


//findOne,findAll and updateOne =>post middleware 
productSchema.post('init', (doc) => {
    setImageURL(doc)
})
//create =>post middleware
productSchema.post('save', (doc)=> {
    setImageURL(doc)
})




const productModel = new mongoose.model('productModel',productSchema)
module.exports= productModel