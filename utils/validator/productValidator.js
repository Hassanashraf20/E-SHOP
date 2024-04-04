const slugify = require('slugify')
const {check,body } = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')
const categoryModel=require("../../models/categoryModel")
const subCategoryModel=require("../../models/subCategoryModel")
const brandsModel = require('../../models/brandsModel')

exports.getProductValidator=[
    check('id').notEmpty().withMessage('id Product is required')
    .isMongoId().withMessage('invalid product id'),
    validaterMiddliware,
]

exports.createProductValidator=[
    check("title").notEmpty().withMessage("Product title is required")
    .isLength({min:3}).withMessage("too short Product title")
    .isLength({max:30}).withMessage("too long Product title")
    .custom((val,{req})=>{
      req.body.slug=slugify(val)
      return true
  }),
    check('description').notEmpty().withMessage("Product description is required")
    .isLength({min:20}).withMessage("too short Product description"),

    check('quantity').notEmpty().withMessage("Product quantity is required")
    .isNumeric().withMessage("Product quantity must be Numeric"),

    check('sold').optional()
    .isNumeric().withMessage("Product sold must be Numeric"),

    check('price').notEmpty().withMessage("Product price is required")
    .isNumeric().withMessage("Product price must be Numeric")
    .isLength({max:20}).withMessage("too long Product price"),

    check('priceAfterDiscount').optional()
    .isNumeric().withMessage("Product priceAfterDiscount must be Numeric")
    .toFloat()
    .custom((value, { req }) => {
        if (req.body.price <= value) {
          throw new Error('priceAfterDiscount must be lower than price');
        }
        return true;
      }),

    check('color').optional()
    .isArray()
    .withMessage('availableColors should be array of string'),

    check('images').optional()
    .isArray()
    .withMessage('images should be array of string'),

    check('imageCover').notEmpty().withMessage("Product imageCover is required"),
    
    check("category").notEmpty().withMessage("Product must be belong to a category")
    .isMongoId().withMessage('invalid Product id')
    .custom((categoryId) => 
         categoryModel.findById(categoryId).then((category)=>{
          if (!category) {
              return Promise.reject(
                new Error(`no category for this Id: ${categoryId}` )
                )
          }
        })
      )
      ,
    
    check('subCategory').optional()
    .isMongoId().withMessage('invalid Product id')
    .custom((subCategoryId)=>
    subCategoryModel.find({_id: {$exists:true,$in:subCategoryId}}).then((result)=>{
      if(result.length < 1 ||result.length != subCategoryId.length){
        return Promise.reject(
          new Error(`invalid subCategory for this Ids`)
        )
      }
    })
    ).custom((val, { req }) =>
    subCategoryModel.find({ category: req.body.category }).then(
      (subcategories) => {
        const subCategoriesIdsInDB = []
        subcategories.forEach((subCategory) => {
          subCategoriesIdsInDB.push(subCategory._id.toString())
        })
        // check if subcategories ids in db include subcategories in req.body (true)
        const checker = (target, arr) => target.every((v) => arr.includes(v))
        if (!checker(val, subCategoriesIdsInDB)) {
          return Promise.reject(
            new Error(`subcategories not belong to category`)
          )
        }
      }
    )
  ),

    check('brands').optional()
    .isMongoId().withMessage('invalid Product id')
    .custom((brandsId)=>
    brandsModel.findById(brandsId).then((brands)=>{
      if(!brands){
        return Promise.reject(
          new Error(`no brands for this Id: ${brandsId}`)
        )
      }
      })
    )
    ,

    check('ratingAvarege').optional()
    .isNumeric().withMessage("Product ratingAvarege must be Numeric")
    .isLength({min:1}).withMessage("too short Product title")
    .isLength({max:5}).withMessage("too long Product title"),

    check('ratingQuantity').optional()
    .isNumeric().withMessage("Product ratingQuantity must be Numeric"),
     validaterMiddliware,
]



exports.updateProductValidator=[
    check('id').isMongoId().withMessage('invalid Product id'),
    body('title').optional().custom((val,{req})=>{
      req.body.slug=slugify(val)
      return true
  }),
    validaterMiddliware,


]

exports.deleteProductValidator=[
    check('id').isMongoId().withMessage('invalid Product id'),
    validaterMiddliware,


]