const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "investor" },
    governmentId: { type: String },
}, { timestamps: true });

const Investor = mongoose.model("Investor", investorSchema);
module.exports = Investor;
