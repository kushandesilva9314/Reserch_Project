const mongoose = require("mongoose");

const ProfilePictureSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

const ProfilePicture = mongoose.model("ProfilePicture", ProfilePictureSchema);
module.exports = ProfilePicture;
