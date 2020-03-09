const express = require("express");
const multer = require("multer");

//import model
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
  //handle pagination
  //adding a plus in front of string converts to a number
  const pageSize = +req.query.pagesize; //for pagination
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  //grab all results if page size or current page equal to null
  postQuery
    .find()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        //res.status must be in .then callback, see comment below
        message: "Posts fetched successfully!",
        posts: fetchedPosts, //fetching data is an async task so a response can be sent outside of post.Find().
        maxPosts: count
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
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
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
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id, //declare id as incoming id, or object will think trying to update immutable object and throw error
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Delete successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  });
});

module.exports = router;
