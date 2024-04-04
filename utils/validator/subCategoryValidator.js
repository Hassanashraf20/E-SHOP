const slugify = require('slugify')
const {check,body } = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')

exports.getSubCategoryValidator=[
    check('id').isMongoId().withMessage('invalid subCategory id'),
    validaterMiddliware,


]

exports.createSubCategoryValidator=[
    check("name").notEmpty().withMessage("subCategory name is required")
    .isLength({min:2}).withMessage("too short subCategory name")
    .isLength({max:30}).withMessage("too long subCategory name")
    .custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    check("category").optional().notEmpty().withMessage("subCategory is required")
    .isMongoId().withMessage('invalid subCategory id'),
    validaterMiddliware,
]

exports.updateSubCategoryValidator=[
    check("id").isMongoId().withMessage('invalid subCategory id'),
    body('name').custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    validaterMiddliware,
]
exports.deleteSubCategoryValidator=[
    check("id").isEmpty().withMessage('subCategory id is required')
    .isMongoId().withMessage('invalid subCategory id'),
    validaterMiddliware,
]