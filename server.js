require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const AuthRoutes = require("./routes/auth/AuthRoutes");
const TriviaRoutes = require("./routes/trivia/TriviaRoutes");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "https://tquiz.netlify.app",
  })
);
app.use(express.json());
app.use(cookieParser());

//DATABASE CONNECTION
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database connected");
});

//set up auth routes and api routes
app.use("/auth", AuthRoutes);
app.use("/trivia", TriviaRoutes);

const port = process.env.PORT || 8000;

app.listen(port);
