const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

//Middleware
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
//Controllers
const reviews = require("../controllers/reviews");

// //Wyslanie komentarza
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.sendReview));

//usuwanie komentarza
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
