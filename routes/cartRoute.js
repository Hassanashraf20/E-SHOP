const express = require ("express")

const {addToCart,getLoggedUserCart,removeSpecificCartItem,clearCart,updateCartItemQuantity,applyCoupon}= require("../services/cartServices")


const authServices=require('../services/authServices')

const router = express.Router()

router.use(authServices.auth,authServices.allowedTo('user'))

router.route("/").get(getLoggedUserCart)
router.route("/").post(addToCart)
router.route("/:itemId").delete(removeSpecificCartItem)
router.route("/").delete(clearCart)
router.route("/applyCoupon").put(applyCoupon)
router.route("/:itemId").put(updateCartItemQuantity)



module.exports = router