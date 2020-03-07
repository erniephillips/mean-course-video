const mongoose = require("mongoose");

//blue print definition
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

//now a model is needed
module.exports = mongoose.model('Post', postSchema);

