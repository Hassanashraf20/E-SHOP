const express = require ("express")

const authServices=require('../services/authServices')

const {addProductToWishList,RemoveProductFromWishList,getLoggedUserWishlist,RemoveAllProductFromWishList}= require("../services/wishListServices")


const router = express.Router()

router.use(authServices.auth,authServices.allowedTo('user'))


router.route('/').post(addProductToWishList).get(getLoggedUserWishlist)
router.route('/:productId').delete(RemoveProductFromWishList)
router.route('/').delete(RemoveAllProductFromWishList)

module.exports = router