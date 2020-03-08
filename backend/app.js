const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express(); //return an express app by excuting function

//database connection
mongoose
  .connect(
    "mongodb+srv://ephillips:admin123@buwebdev-cluster-1-2f0a0.mongodb.net/mean-course-video?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

//install body-parser to access posted data
app.use(bodyParser.json()); //parses body of requests to json data for easy reading
//this is for parsing url encoded data to json: app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//make express aware of post routes
app.use("/api/posts", postRoutes);

module.exports = app;
