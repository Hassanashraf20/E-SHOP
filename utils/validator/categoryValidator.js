const slugify = require('slugify')
const {check,body } = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')
exports.getCategoryValidator=[
    check('id').isMongoId().withMessage('invalid category id'),
    validaterMiddliware,


]

exports.createValidator=[
    check("name").notEmpty().withMessage("category is required")
    .isLength({min:3}).withMessage("too short category name")
    .isLength({max:30}).withMessage("too long category name")
    .custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    validaterMiddliware,
]

exports.updateCategoryValidator=[
    check('id').isMongoId().withMessage('invalid category id'),
    body('name').optional().custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    validaterMiddliware,


]

exports.deleteCategoryValidator=[
    check('id').isMongoId().withMessage('invalid category id'),
    validaterMiddliware,


]