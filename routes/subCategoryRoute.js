const express = require ("express")
const {createSubCategoryValidator,getSubCategoryValidator,updateSubCategoryValidator,deleteSubCategoryValidator}=require("../utils/validator/subCategoryValidator")
const {createSubCategory,getsubCategory,getsubCategories,updateSubCategory,deleteSubCategory,setCategoryIdToBody}=require("../services/subCategoryServices")

const authServices=require('../services/authServices')


//{mergeParams:true} to accses params from other router
const router = express.Router({mergeParams:true})

router.get("/",getsubCategories)
router.post("/",authServices.auth,authServices.allowedTo('admin','manager'),createSubCategoryValidator,setCategoryIdToBody,createSubCategory)
router.route('/:id').get(getSubCategoryValidator,getsubCategory)

router.put("/:id",authServices.auth,authServices.allowedTo('admin','manager'),updateSubCategoryValidator,updateSubCategory)
router.delete("/:id",authServices.auth,authServices.allowedTo('admin'),deleteSubCategoryValidator,deleteSubCategory)

 



module.exports = router