// external imports
const express = require("express");
require("dotenv").config();
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// initialization
const app = express();
const port = process.env.PORT || 5000;

// database connection
mongoose
  .connect(process.env.MONGOS_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoose connection successful!"))
  .catch((err) => console.log(err));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  cookieSession({
    name: process.env.COOKIE_NAME,
    keys: [process.env.COOKIE_SECRET],
    maxAge: process.env.JWT_EXPIRY,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log("Skill assessment server running on", port);
});
