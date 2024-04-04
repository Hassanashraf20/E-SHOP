const {check} = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')



exports.getCouponValidator=[
    check('id').isMongoId().withMessage('invalid Coupon id'),
    validaterMiddliware,


]

exports.createCouponValidator=[
    check("name").notEmpty().withMessage("Coupon name is required").toUpperCase(),
    check("expire").notEmpty().withMessage("Coupon expire timeis required")
    .isDate({format: 'DD/MM/YYYY', delimiters: ['/', '-']}).withMessage(" Invalid expire Date => format must be 'DD/MM/YYYY' "),
    check("discount").notEmpty().withMessage("Coupon discount required").isInt(),
    validaterMiddliware,
]

exports.updateCouponValidator=[
    check('id').isMongoId().withMessage('invalid Coupon id'),
    check("name").optional().notEmpty().withMessage("Coupon name is required").toUpperCase(),
    check("expire").optional().notEmpty().withMessage("Coupon expire timeis required")
    .isDate({format: 'DD/MM/YYYY', delimiters: ['/', '-']}).withMessage(" Invalid expire Date => format must be 'DD/MM/YYYY' "),
    check("discount").optional().notEmpty().withMessage("Coupon discount required").isInt(),

    validaterMiddliware,

]

exports.deleteCouponValidator=[
    check('id').isMongoId().withMessage('invalid Coupon id'),
    validaterMiddliware,


]