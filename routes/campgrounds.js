const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
//Model
const Campground = require("../models/campground");
//Middleware
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//Controllers
const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
// .post(upload.array("image"), (req, res) => {
// console.log(req.body, req.files);
// res.send("It worked!");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.get("/paginated", async (req, res) => {
  const aggregateQuery = Campground.aggregate();

  Campground.aggregatePaginate(
    aggregateQuery,
    { page: 1, limit: 2 },
    function (err, result) {
      if (err) {
        console.err(err);
      } else {
        const data = result.docs;
        res.render("campgrounds/paginated", { data });
      }
    }
  );
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(campgrounds.renderDetails))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
