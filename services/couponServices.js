const Coupon = require('../models/couponModel')

const factoryHandler=require("./handlerFactory")




//@desc createCoupon
//@route POST api/Coupons
//@accses privte/admin-manager
exports.createCoupons=factoryHandler.createOne(Coupon)

//@desc Get list of Coupons
//@route GET api/v1/Coupons
//@accses privte/admin-manager
exports.getCoupons=factoryHandler.getAll(Coupon)

//@desc Get Spacific Coupon
//@route GET api/Coupons/:id
//@accses privte/admin-manager
exports.getCoupon=factoryHandler.getOne(Coupon)

//@desc UpdateCoupon
//@route PUT api/Coupons/:id
//@accses privte/admin-manager
exports.updateCoupons=factoryHandler.updateOne(Coupon)


//@desc DeleteCoupon
//@route DELETE api/Coupons/:id
//@accses privte/admin-manager
exports.deleteCoupon=factoryHandler.deleteOne(Coupon)
