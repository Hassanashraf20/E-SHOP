const express = require ("express")

const {signup,login,forgotPassword,verifyResetCode,resetPassword}= require("../services/authServices")
const {signUpValidator,loginValidator}= require("../utils/validator/authValidator")

const router = express.Router()


router.route("/signup").post(signUpValidator,signup)
router.route("/login").post(loginValidator,login)
router.route("/forgotPassword").post(forgotPassword)
router.route("/verifyResetCode").post(verifyResetCode)
router.route("/resetPassword").put(resetPassword)
module.exports = router