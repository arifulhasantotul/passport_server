// external imports
const express = require("express");
require("dotenv").config();
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

// initialization
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cookieSession({ name: "session", keys: ["assessment"], maxAge: "86400000" })
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
