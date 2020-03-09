const mongoose = require("mongoose");

//blue print definition
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } //ref refers to User model
});

//now a model is needed
module.exports = mongoose.model("Post", postSchema);
