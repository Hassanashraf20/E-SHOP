const express = require ("express")

const {createCoupons,getCoupons,getCoupon,updateCoupons,deleteCoupon}= require("../services/couponServices")
const {getCouponValidator,createCouponValidator,updateCouponValidator,deleteCouponValidator}= require("../utils/validator/couponValidator")



const authServices=require('../services/authServices')


const router = express.Router()

router.use(authServices.auth,authServices.allowedTo('admin','manager'))

router.route("/").get(getCoupons)
router.route("/").post(createCouponValidator,createCoupons)
router.route("/:id").get(getCouponValidator,getCoupon).put(updateCouponValidator,updateCoupons).delete(deleteCouponValidator,deleteCoupon)


module.exports = router