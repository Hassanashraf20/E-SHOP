const slugify = require('slugify')
const {check } = require('express-validator')
const validaterMiddliware=require('../../middlewares/validatorMidlleware')
const userModel = require('../../models/userModel')
const bcrypt = require('bcryptjs')

exports.createUserValidator=[
    check("name").notEmpty().withMessage("User name is required")
    .isLength({min:3}).withMessage("too short User name")
    .custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),

    check('email').notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email')
    .custom((val)=>
    userModel.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('e-mail alaredy in used'))
        }
    })
    ),

    check('password').notEmpty().withMessage('password is required')
    .isLength({min:6}).withMessage("password must be at least 6 Characters")
    .custom((password,{req})=>{
        if(password!=req.body.passwordConfirm){
            throw new Error('passwordConfirm incorrect')
        }
        return true
    }),

    check('passwordConfirm').notEmpty().withMessage('passwordConfirm is required'),


    check('phone').optional()
    .isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profilePhoto').optional(),
    check('role').optional(),
    validaterMiddliware,
]


exports.getUserValidator=[
    check('id').isMongoId().withMessage('invalid User id'),
    validaterMiddliware,


]


exports.updateUserValidator=[
    check('id').isMongoId().withMessage('invalid User id'),
    check('name').optional().custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    check('email').notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email')
    .custom((val)=>
    userModel.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('e-mail alaredy in used'))
        }
    })
    ),
    check('phone').optional()
    .isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profilePhoto').optional(),
    check('role').optional(),
    validaterMiddliware,

]


exports.changeUserPasswordValidator=[
    check('id').isMongoId().withMessage('invalid user id'),
    check('currentPassword').notEmpty().withMessage('You must enter the current Password '),
    check('passwordConfirm').notEmpty().withMessage('You must enter the password confirm'),
    check('password').notEmpty().withMessage('You must enter the password ')
    .custom(async(val,{req})=>{
        // 1) Verify current password
        const user =await userModel.findById(req.params.id)
        if(!user){
            throw new Error('There is no user for this id')
        }
        const isMatch = await bcrypt.compare(req.body.currentPassword,user.password)
        if(!isMatch){
            throw new Error('Your current password is incorrect')
        }
        // 2) Verify password confirm
        if(val!== req.body.passwordConfirm){
            throw new Error('Passwords do not match')
        }
        return true
         
    }),

    validaterMiddliware,
]





exports.deleteUserValidator=[
    check('id').isMongoId().withMessage('invalid user id'),
    validaterMiddliware,


]




exports.updateLoggedUserValidator=[
    check('name').optional().custom((val,{req})=>{
        req.body.slug=slugify(val)
        return true
    }),
    check('email').optional().notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email')
    .custom((val)=>
    userModel.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('e-mail alaredy in used'))
        }
    })
    ),
    check('phone').optional()
    .isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profilePhoto').optional(),

    validaterMiddliware,
]

