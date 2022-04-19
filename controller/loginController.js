// external imports
const bcrypt = require("bcrypt");
require("dotenv").config();
const passport = require("passport");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/People");

// urls
const CLIENT_URL = `${process.env.FRONTEND_URL}/home`;
const CLIENT_LOGIN_URL = `${process.env.FRONTEND_URL}/login`;

// google success login
async function googleSuccessLogin(req, res, next) {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "success",
      user: req.user,
    });
  }
}

// google failed login
async function googleFailedLogin(req, res, next) {
  res.status(401).json({
    success: false,
    message: "failure",
  });
}

// login
async function login(req, res, next) {
  try {
    // match user email/mobile data to db
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { phone: req.body.username }],
    });

    if (user && user._id) {
      // check password validation
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        console.log(isValidPassword);
        // create user object to generate token
        const userObject = {
          userId: user._id,
          userName: user.name,
          email: user.email,
          role: user.role || "User",
        };
        console.log(userObject);

        // generate token for cookies
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // res cookies
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set logged in user to local variable
        res.status(200).json({
          success: true,
          message: "success",
          user: req.userObject,
        });
      } else {
        throw createError("Login failed. Please try again");
      }
    } else {
      throw createError("Login failed. Please try again");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// logout
async function logout(req, res) {
  req.logout();
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).redirect(CLIENT_LOGIN_URL);
}

module.exports = {
  googleSuccessLogin,
  googleFailedLogin,
  login,
  logout,
};
