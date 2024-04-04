const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')


const brandsModel = require('../models/brandsModel')
const factoryHandler=require("./handlerFactory")
const {uploadSingleImage} = require("../middlewares/uploadImageMidlleware")




//upload SingleImage
exports.uploadBrandImage= uploadSingleImage('image')

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
  if(req.file){
    await sharp(req.file.buffer)
      .resize(600,600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/Brands/${filename}`)
  
    // Save image into our db 
     req.body.image = filename
  }
    next()
  })


//@desc createBrands
//@route POST api/Brands
//@accses privte/admin-manager
exports.createBrands=factoryHandler.createOne(brandsModel)

//@desc Get list of brands
//@route GET api/v1/brands
//@accses puplic
exports.getBrands=factoryHandler.getAll(brandsModel)

//@desc Get Spacific brand
//@route GET api/brand/:id
//@accses puplic
exports.getBrand=factoryHandler.getOne(brandsModel)

//@desc UpdateBrand
//@route PUT api/brands/:id
//@accses privte/admin-manager
exports.updateBrands=factoryHandler.updateOne(brandsModel)


//@desc Deletebrands
//@route DELETE api/brands/:id
//@accses privte/admin-manager
exports.deleteBrand=factoryHandler.deleteOne(brandsModel)
