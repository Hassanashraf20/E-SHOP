const mongoose= require("mongoose")
const brandsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Brand is required'],
        unique:[true,'Brands must be unique'],
        minlength:[2,'too short Brands name'],
        maxlength:[30,'too long Brands name'],
    },
    slug:{
        type:String,
        lowercase:true,
    },
    image:{
        type:String,
    }



},{timestamps:true})

const setImageURL=(doc)=>{
    if(doc.image){
    const imageUrl=`${process.env.BASE_URL}/brands/${doc.image}`
    doc.image=imageUrl
 }
}
//findOne,findAll and updateOne =>post middleware 
brandsSchema.post('init', (doc) => {
    setImageURL(doc)
})
//create =>post middleware
brandsSchema.post('save', (doc)=> {
    setImageURL(doc)
})


const brandsModel= new mongoose.model('brandsModel',brandsSchema)
module.exports =brandsModel


