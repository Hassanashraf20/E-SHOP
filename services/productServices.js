const productModel = require("../models/productModel")
const factoryHandler=require("./handlerFactory")

const {uploadMixImage}=require('../middlewares/uploadImageMidlleware')

const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')


exports.uploadProductImage= uploadMixImage([{
    name:"imageCover",
    maxCount:1
},{
    name:"images",
    maxCount:5
}])


exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    
    //1- Image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
  
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/Products/${imageCoverFileName}`)
  
      // Save image into our db
      req.body.imageCover = imageCoverFileName
    }
    //2- Image processing for images
    if (req.files.images) {
      if (req.files.images) {
        req.body.images = []
        await Promise.all(
          req.files.images.map(async (img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
    
            await sharp(img.buffer)
              .resize(600, 600)
              .toFormat('jpeg')
              .jpeg({ quality: 95 })
              .toFile(`uploads/Products/${imageName}`)
    
            // Save image into our db
            req.body.images.push(imageName)
          })
      )
        
      }

    }next()

    
  })
   


//@desc Get list of products
//@route GET api/products
//@accses puplic
exports.getProducts = factoryHandler.getAll(productModel,"products")

//@desc createProduct 
//@route POST api/products
//@accses privte/admin-manager
exports.createProduct=factoryHandler.createOne(productModel)


//@desc Get Spacific product
//@route GET api/product/:id
//@accses puplic
exports.getProduct=factoryHandler.getOne(productModel,'reviews')


//@desc UpdateProduct
//@route PUT api/products/:id
//@accses privte/admin-manager
exports.updateProduct=factoryHandler.updateOne(productModel)

//@desc DeleteProduct
//@route DELETE api/Products/:id
//@accses privte/admin-manager
exports.deleteProduct=factoryHandler.deleteOne(productModel)
