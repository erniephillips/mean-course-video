const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//import models
const Post = require("./models/post");

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save(); //save to database -- mongoose creates query in bg to save to db
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = new Post();
  Post.find().then(documents => {
    res.status(200).json({
      //res.status must be in .then callback, see comment below
      message: "Posts fetched successfully!",
      posts: documents //fetching data is an async task so a response can be sent outside of post.Find().
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post of id: " + req.params.id + " deleted!" });
  });
});

module.exports = app;
