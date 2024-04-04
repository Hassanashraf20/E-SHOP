const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')


const Categorymodel = require("../models/categoryModel")
const factoryHandler=require("./handlerFactory")
const {uploadSingleImage} = require("../middlewares/uploadImageMidlleware")



//@desc upload SingleImage
exports.uploadCategoryImage= uploadSingleImage('image')



// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
  if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`)

  // Save image into our db 
   req.body.image = filename
}
next()
})




//@desc Get list of categories
//@route GET api/categories
//@accses puplic
exports.getCategories=factoryHandler.getAll(Categorymodel)

//@desc Get Spacific category
//@route GET api/category/:id
//@accses puplic
exports.getCategory=factoryHandler.getOne(Categorymodel)


//@desc createCategory 
//@route POST api/categories
//@accses privte/admin-manager
exports.createCategory=factoryHandler.createOne(Categorymodel)

//@desc UpdateCategory
//@route PUT api/categories/:id
//@accses privte/admin-manager
exports.updateCategory=factoryHandler.updateOne(Categorymodel)



//@desc DeleteCategory
//@route DELETE api/categories/:id
//@accses privte/admin-manager
exports.deleteCategory=factoryHandler.deleteOne(Categorymodel)




//exports.resizeImage= asyncHandler(async(req,res,next)=>{
   // const filename=`category-${uuidv4()}-${Date.now()}.jpeg`

    //await sharp(req.file.buffer)
    //.resize(500, 500)
    //.toFormat('jpeg')
    //.jpeg({quality:95})
    //.toFile(`uploads/Categories/${filename}`)
    
   //next()
//})