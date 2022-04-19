// external imports
const express = require("express");
const passport = require("passport");
const { addUser } = require("../controller/registerController");
require("dotenv").config();

const CLIENT_URL = `${process.env.FRONTEND_URL}/home`;
const CLIENT_LOGIN_URL = `${process.env.FRONTEND_URL}/login`;

const router = express.Router();

router.post("/register", addUser);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "success",
      user: req.user,
    });
  }
});
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
router.get("/logout", (req, res) => {
  req.logOut();
  res.status(200).redirect(CLIENT_LOGIN_URL);
});

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

module.exports = router;
