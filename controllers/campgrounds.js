const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const geometry = geoData.body.features[0].geometry;

  const newCampground = new Campground(req.body.campground);
  newCampground.geometry = geometry;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  console.log(newCampground);
  req.flash("success", "Successfully made a new Campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "Sorry, there is no such a Campground!");
    return res.redirect(`/campgrounds/${id}`);
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const edited = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    {
      new: true,
      runValidators: true,
    }
  );
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  edited.images.push(...imgs);
  await edited.save();
  if (req.body.deleteImages) {
    // for (let filename of req.body.deleteImages) {
    //   await cloudinary.uploader.destroy(filename);
    // }
    req.body.deleteImages.map(async (filename) => {
      await cloudinary.uploader.destroy(filename);
    });
    await edited.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated Campground!");
  res.redirect(`/campgrounds/${edited._id}`);
};

module.exports.renderDetails = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Sorry, cannot find that Campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/details", { campground });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Campground!");
  res.redirect("/campgrounds");
};
