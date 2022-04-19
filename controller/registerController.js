// external imports
const { hash } = require("bcrypt");

// internal imports
const User = require("../models/People");

// add user
async function addUser(req, res, next) {
  let newUser;
  const saltRound = 10;

  try {
    const hashedPassword = await hash(req.body.password, saltRound);
    newUser = new User({ ...req.body, password: hashedPassword });

    // save user
    await newUser.save();
    res.status(200).json({
      toast: "success",
      message: "User added successfully!",
    });
  } catch (err) {
    // send error
    res.status(500).json({
      errors: {
        common: {
          msg: err,
        },
      },
    });
  }
}

module.exports = { addUser };
