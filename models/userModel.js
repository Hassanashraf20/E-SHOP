const mongoose= require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,'user name is required '],
        trim:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email must be unique'],
    },
    password:{
        type:String,
        minlength:[6,'too short password'],
    },
    
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean,


    phone:{
        type:String
    },
    profilePhoto:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','manager','admin'],
        default:'user',
    },
    active:{
        type:Boolean,
        default:true,
    },
    // child reference (one to many)
    wishList:[{
        type:mongoose.Schema.ObjectId,
        ref:'productModel'
    }],
    addresses:[{
        id:{ type : mongoose.Schema.Types.ObjectId },
        alias:String,
        details:String,
        phone:String,
        city:String,
        postalCode:String,
    }],
},{timestamps:true})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12)
    next()
  })





const setImageURL=(doc)=>{
    if(doc.profilePhoto){
    const imageUrl=`${process.env.BASE_URL}/users/${doc.profilePhoto}`
    doc.profilePhoto=imageUrl
 }
}
//findOne,findAll and updateOne =>post middleware 
userSchema.post('init', (doc) => {
    setImageURL(doc)
})
//create =>post middleware
userSchema.post('save', (doc)=> {
    setImageURL(doc)
})



const userModel=new mongoose.model('userModel',userSchema)
module.exports=userModel