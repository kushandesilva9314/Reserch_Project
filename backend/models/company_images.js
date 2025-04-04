const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    companyEmail: { type: String, required: true },
    profile: { type: String, default: null },
    cover: { type: String, default: null },
});

module.exports = mongoose.model("Image", imageSchema);
