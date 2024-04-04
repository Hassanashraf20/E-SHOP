const express = require ("express")

const authServices=require('../services/authServices')

const {addAddress,
    RemoveAddressFromaddresses,
    RemoveAllAddressFromaddresses,
    getLoggedUseraddresses,}= require("../services/addressServices")


const router = express.Router()

router.use(authServices.auth,authServices.allowedTo('user'))


router.route('/').post(addAddress).get(getLoggedUseraddresses)
router.route('/:addressId').delete(RemoveAddressFromaddresses)
router.route('/').delete(RemoveAllAddressFromaddresses)


//router.route('/addressId').put(updateAddress)


module.exports = router