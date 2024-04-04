const express = require ("express")

const {createCashOrder , getAllOrders ,
      filterOrderForLoggedUser , findSpecificOrder ,
      updateOrderToPaid ,updateOrderToDeliverd,
      checkoutSession}= require("../services/orderServices")


const authServices=require('../services/authServices')

const router = express.Router()

router.use(authServices.auth)


router.route("/checkout-session/:cartId").post(authServices.allowedTo('user'),checkoutSession)


router.route("/").get(authServices.allowedTo('user','admin','manager'),filterOrderForLoggedUser,getAllOrders)
router.route("/:cartId").post(authServices.allowedTo('user'),createCashOrder)
router.route("/:id").get(authServices.allowedTo('user'),findSpecificOrder)

router.route("/:id/pay").put(authServices.allowedTo('admin','manager'),updateOrderToPaid)
router.route("/:id/deliver").put(authServices.allowedTo('admin','manager'),updateOrderToDeliverd)



module.exports = router