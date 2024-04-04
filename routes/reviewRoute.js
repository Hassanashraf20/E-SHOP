const express = require ("express")

const {createReview,getReviews,getReview,updateReview,deleteReview,createFilterObj,setProductIdAndUserIdToBody}= require("../services/reviewServices")
const {createReviewValidator,getReviewValidator,updateReviewValidator,deleteReviewValidator}= require("../utils/validator/reviewValidator")

const authServices=require('../services/authServices')

//{mergeParams:true} to accses params from other router
const router = express.Router({mergeParams:true})

router.route("/").get(createFilterObj,getReviews)
router.route("/").post(authServices.auth,authServices.allowedTo('user'),setProductIdAndUserIdToBody,createReviewValidator,createReview)
router.route("/:id").get(getReviewValidator,getReview)
router.route("/:id").put(authServices.auth,authServices.allowedTo('user'),updateReviewValidator,updateReview)
router.route("/:id").delete(authServices.auth,authServices.allowedTo('user','admin','manager'),deleteReviewValidator,deleteReview)



module.exports = router