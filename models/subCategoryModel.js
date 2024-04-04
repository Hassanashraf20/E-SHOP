const mongoose =require("mongoose")
const slugify = require("slugify")

const subCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        unique:[true,"subCategory must be unique"],
        minlength:[2,"too short subCategory name"],
        maxlength:[30,"too long subCategory name"]

    },slug:{
        type:String,
        lowercase:true,
    },
    category:{
       type:mongoose.Schema.ObjectId,
       ref:"Category" ,
       require:[true,"subCategoru must be belong to parent Category"]

    },


},{timestamps:true})

const subCategorymodel = new mongoose.model("subCategory",subCategorySchema)

module.exports = subCategorymodel
//module.exports = mongoose.model("subCategory",subCategorySchema)