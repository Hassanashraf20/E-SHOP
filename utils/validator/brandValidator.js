const slugify = require('slugify')
const {check,body } = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')
exports.getBrandValidator=[
    check('id').isMongoId().withMessage('invalid Brand id'),
    validaterMiddliware,


]

exports.createBrandValidator=[
    check("name").notEmpty().withMessage("Brand is required")
    .isLength({min:3}).withMessage("too short Brand name")
    .isLength({max:30}).withMessage("too long Brand name").custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    validaterMiddliware,
]

exports.updateBrandValidator=[
    check('id').isMongoId().withMessage('invalid Brand id'),
    body('name').optional().custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    validaterMiddliware,


]

exports.deleteBrandValidator=[
    check('id').isMongoId().withMessage('invalid Brand id'),
    validaterMiddliware,


]