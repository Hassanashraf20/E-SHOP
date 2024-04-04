const express = require ("express")

const {createUsers,getUsers,getUser,updateUser,
    changeUserPassword,deleteUser,uploadUserImage,resizeprofilePhoto,
    getLoggedUser,updateLoggedUserPassword,updateLoggedUserData,deactivateLoggedUser
}= require("../services/userServices")


const {createUserValidator,getUserValidator,updateUserValidator,
    changeUserPasswordValidator,deleteUserValidator,updateLoggedUserValidator
}= require("../utils/validator/userValidator")


const authServices=require('../services/authServices')


const router = express.Router()

router.use(authServices.auth)

router.route('/getMe').get(getLoggedUser,getUser)
router.route('/changeMyPassword').put(updateLoggedUserPassword)
router.route('/updateMe').put(updateLoggedUserValidator,uploadUserImage,resizeprofilePhoto,updateLoggedUserData)
router.route('/deactivateMe').delete(deactivateLoggedUser)


//admin
router.route('/changePassword/:id').put(changeUserPasswordValidator,changeUserPassword)

router.use(authServices.allowedTo('admin'))

router.route("/").get(getUsers)
router.route("/").post(uploadUserImage,resizeprofilePhoto,createUserValidator,createUsers)
router.route("/:id").get(getUserValidator,getUser)
router.route("/:id").put(uploadUserImage,resizeprofilePhoto,updateUserValidator,updateUser)
router.route("/:id").delete(deleteUserValidator,deleteUser)




module.exports = router