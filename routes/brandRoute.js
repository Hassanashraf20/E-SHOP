const express = require ("express")

const {createBrands,getBrands,getBrand,updateBrands,deleteBrand,uploadBrandImage,resizeImage}= require("../services/brandServices")
const {createBrandValidator,getBrandValidator,updateBrandValidator,deleteBrandValidator}= require("../utils/validator/brandValidator")

const authServices=require('../services/authServices')


const router = express.Router()

router.route("/").get(getBrands)
router.route("/").post(authServices.auth,authServices.allowedTo('admin','manager'),uploadBrandImage,resizeImage,createBrandValidator,createBrands)
router.route("/:id").get(getBrandValidator,getBrand)
router.route("/:id").put(authServices.auth,authServices.allowedTo('admin','manager'),uploadBrandImage,resizeImage,updateBrandValidator,updateBrands)
router.route("/:id").delete(authServices.auth,authServices.allowedTo('admin'),deleteBrandValidator,deleteBrand)



module.exports = router