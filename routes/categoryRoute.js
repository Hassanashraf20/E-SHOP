const express = require ("express")
const {getCategoryValidator,createValidator,updateCategoryValidator,deleteCategoryValidator}=require('../utils/validator/categoryValidator')
const {getCategories,createCategory,getCategory,updateCategory,deleteCategory, uploadCategoryImage,resizeImage} = require("../services/categoryServices")

const authServices=require('../services/authServices')

const router = express.Router()

const subCategoryRoute =require("./subCategoryRoute")
router.use("/:categoryId/subcategories",subCategoryRoute)



router.get("/",getCategories)
router.post("/",authServices.auth,authServices.allowedTo('admin','manager'),uploadCategoryImage,resizeImage,createValidator,createCategory)
router.route('/:id').get(getCategoryValidator,getCategory)

router.put("/:id",authServices.auth,authServices.allowedTo('admin','manager'),uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
router.delete("/:id",authServices.auth,authServices.allowedTo('admin'),deleteCategoryValidator,deleteCategory)


module.exports = router
