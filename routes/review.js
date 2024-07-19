const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');

const {
	validateReviews,
	isLoggedIn,
	isReviewAuthor,
} = require('../middleware.js');
const reviewController = require('../controller/review.js');

//create review route
router.post(
	'/',
	isLoggedIn,
	validateReviews,
	wrapAsync(reviewController.createReview)
);

//delete review route

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	wrapAsync(reviewController.destroyReview)
);

module.exports = router;
