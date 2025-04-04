const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
    {
        investment: { type: Number, required: true, min: 1 },
        percentage: { type: Number, required: true, min: 1, max: 100 },
        description: { type: String, required: true, trim: true },
        companyEmail: { type: String, required: true, trim: true, lowercase: true },
        companyName: { type: String, required: true, trim: true },
        businessType: { type: String, required: true, enum: ["Startups", "SMEs", "Large Scale"] },
    },
    { timestamps: true }
);

const Ad = mongoose.model("Ad", AdSchema);
module.exports = Ad;
