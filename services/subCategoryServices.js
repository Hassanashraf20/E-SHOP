const asyncHandler = require('express-async-handler')
const subCategorymodel = require("../models/subCategoryModel")
const factoryHandler=require("./handlerFactory")

exports.setCategoryIdToBody= (req,res,next)=>{
    // Nested route (Create)
   if(!req.body.category) req.body.category=req.params.categoryId
    next()
}


//@desc createSubCategory 
//@route POST api/subcategoris
//@accses privte
exports.createSubCategory=factoryHandler.createOne(subCategorymodel)


// GET    api/categories/categoryId/subcategories"
//@desc Get list of subcategoris
//@route GET api/subcategoris
//@accses puplic
exports.getsubCategories = asyncHandler( async (req,res)=>{
    //Pagination
const page = req.query.page *1 ||1
const limit = req.query.limit *1 ||50
const skip = (page-1)*limit

let filterObj={}
if(req.params.categoryId) filterObj = {category : req.params.categoryId} 

const subCategories = await subCategorymodel.find(filterObj).skip(skip).limit(limit)
//.populate({path:"category",Select:"name"})
res.status(200).json({result:subCategories.length ,page, data:subCategories})

})


//@desc Get Spacific subCategory
//@route GET api/subcategory/:id
//@accses puplic
exports.getsubCategory=factoryHandler.getOne(subCategorymodel)


//@desc UpdateSubCategory
//@route PUT api/subCategories/:id
//@accses privte
exports.updateSubCategory=factoryHandler.updateOne(subCategorymodel)   


//@desc deleteSubCategory
//@route Deleteapi/subCategories/:id
//@accses privte
exports.deleteSubCategory=factoryHandler.deleteOne(subCategorymodel)
