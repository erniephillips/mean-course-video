const express = require("express");

//import model
const Post = require("../models/post");

const router = express.Router();

router.get("", (req, res, next) => {
  const posts = new Post();
  Post.find().then(documents => {
    res.status(200).json({
      //res.status must be in .then callback, see comment below
      message: "Posts fetched successfully!",
      posts: documents //fetching data is an async task so a response can be sent outside of post.Find().
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  }); //save to database -- mongoose creates query in bg to save to db
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id, //declare id as incoming id, or object will think trying to update immutable object and throw error
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res
      .status(200)
      .json({ message: "Post of id: " + req.params.id + " deleted!" });
  });
});

module.exports = router;
