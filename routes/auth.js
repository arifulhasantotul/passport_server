// external imports
const express = require("express");
const passport = require("passport");
const {
  login,
  googleSuccessLogin,
  googleFailedLogin,
  logout,
} = require("../controller/loginController");
const { addUser } = require("../controller/registerController");
require("dotenv").config();

// urls
const CLIENT_URL = `${process.env.FRONTEND_URL}/home`;

const router = express.Router();

router.post("/register", addUser);

router.post("/signing", login);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/login/success", googleSuccessLogin);

router.get("/login/failed", googleFailedLogin);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", logout);

module.exports = router;
