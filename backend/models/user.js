const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//blue print definition
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique does not automatically act like a validator so it will not auto throw an error if dup entry exists
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //this package will cause validation that unique user inserted

//now a model is needed
module.exports = mongoose.model("User", userSchema);
