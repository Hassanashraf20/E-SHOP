const asyncHandler = require('express-async-handler')


const review = require('../models/reviewModel')
const factoryHandler=require("./handlerFactory")

// Nested route
// GET /api/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {}
    if (req.params.productId) filterObject = { product: req.params.productId }
    req.filterObj = filterObject
    next()
}


// Nested route
// POST /api/products/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId
    if (!req.body.user) req.body.user = req.user._id
    next()
}


//@desc createReview
//@route POST api/reviews
//@accses Private/auth/user
exports.createReview=factoryHandler.createOne(review)

//@desc Get list of reviews
//@route GET api/reviews
//@accses puplic
exports.getReviews=factoryHandler.getAll(review)

//@desc Get Spacific reviews
//@route GET api/reviews/:id
//@accses puplic
exports.getReview=factoryHandler.getOne(review)

//@desc Updatereview
//@route PUT api/reviews/:id
//@accses Private/auth/user
exports.updateReview=factoryHandler.updateOne(review)


//@desc Deletereview
//@route DELETE api/reviews/:id
//@accses Private/auth/user-admin-manager
exports.deleteReview=factoryHandler.deleteOne(review)
