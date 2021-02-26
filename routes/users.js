const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );
//middleware passport.authenticate(strategy: local, google, twitter itd, flash o bledzie, i przekierowanie do stony logowania, a potem konroler logujacy)

router.get("/logout", users.logoutUser);

module.exports = router;
