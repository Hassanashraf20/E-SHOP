const express = require ("express")
const {createProduct,getProducts,getProduct,updateProduct,deleteProduct,uploadProductImage,resizeProductImages}=require('../services/productServices')
const {createProductValidator,getProductValidator,updateProductValidator,deleteProductValidator}=require('../utils/validator/productValidator')

const authServices=require('../services/authServices')

const router = express.Router()

//Nasted Route
const reviewRoute =require("./reviewRoute")
router.use("/:productId/reviews",reviewRoute)


router.get("/",getProducts)
router.post("/",authServices.auth,authServices.allowedTo('admin','manager'),uploadProductImage,resizeProductImages,createProductValidator,createProduct)
router.route('/:id').get(getProductValidator,getProduct)

router.put("/:id",authServices.auth,authServices.allowedTo('admin','manager'),uploadProductImage,resizeProductImages,updateProductValidator,updateProduct)
router.delete("/:id",authServices.auth,authServices.allowedTo('admin'),deleteProductValidator,deleteProduct)


module.exports = router