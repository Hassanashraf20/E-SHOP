const mongoose = require("mongoose")
const dotenv = require("dotenv")

// create Schema
const Categoryschema = new mongoose.Schema({
    name: {
        type:String,
        require:[true,'category is required'],
        unique:[true,'category must be unique'],
        minlength:[3,'too short category name'],
        maxlength:[30,'too long category name']


    },
    slug:{
        type:String,
        lowercase:true,
    },
    image:{
        type:String,

    },
},{timestamps:true})

const setImageURL=(doc)=>{
    if(doc.image){
    const imageUrl=`${process.env.BASE_URL}/categories/${doc.image}`
    doc.image=imageUrl
 }
}
//findOne,findAll and updateOne =>post middleware 
Categoryschema.post('init', (doc) => {
    setImageURL(doc)
})
//create =>post middleware
Categoryschema.post('save', (doc)=> {
    setImageURL(doc)
})

//create modle
const Categorymodel = new mongoose.model("Category",Categoryschema)

module.exports = Categorymodel