const Review=require('../../models/reviewModel')

const {check} = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')




exports.createReviewValidator=[
    check("title").optional().notEmpty(),
    check("ratings").notEmpty().withMessage(" ratings Review is required")
    .isFloat({min:3,max:5}).withMessage("ratings Review must be between 1 to 5 "),
    check("user").notEmpty().withMessage(" user Id is required")
    .isMongoId().withMessage("Invalid Review user Id Format"),
    check("product").notEmpty().withMessage(" product Id is required")
    .isMongoId().withMessage("Invalid Review product Id Format")
    .custom((val,{req})=>
        //Check if logged user create review before
        Review.findOne({user:req.user._id,product:req.body.product}).then((review)=>{
            if(review){
                return Promise.reject(new Error('You already created a review before'))
            }
        })
    ),
    validaterMiddliware,
]





exports.getReviewValidator=[
    check('id').isMongoId().withMessage('invalid Review id'),
    validaterMiddliware,


]




exports.updateReviewValidator=[
    check('id').isMongoId().withMessage('invalid Review id')
    .custom((val,{req})=>
        Review.findById(val).then((review)=>{
            if(!review){
                return Promise.reject(new Error(`There is no review with id ${val}`))
            }
            // Check review ownership before update
            if(review.user._id.toString()!=req.user._id.toString()){
                return Promise.reject(new Error(`Your are not allowed to perform this action`))
            }

        })
    ),
    validaterMiddliware,


]


exports.deleteReviewValidator=[
    check('id').isMongoId().withMessage('invalid Review id')
    .custom((val,{req})=>{  
         if(req.user.role ==='user'){
        return   Review.findById(val).then((review)=>{
            if(!review){
                return Promise.reject(new Error(`There is no review with id ${val}`))
            }
            // Check review ownership before update
            if(review.user._id.toString()!=req.user._id.toString()){
                return Promise.reject(new Error(`Your are not allowed to perform this action`))
            }
        })
    }
    return true
    }),
    validaterMiddliware,


]