const express = require("express");
const multer = require("multer");

//import model
const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//tell multer where to store incoming files
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(null, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("-"); //remove any white space
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  }
});

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

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    }); //save to database -- mongoose creates query in bg to save to db
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id, //declare id as incoming id, or object will think trying to update immutable object and throw error
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      console.log(result);
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res
      .status(200)
      .json({ message: "Post of id: " + req.params.id + " deleted!" });
  });
});

module.exports = router;
