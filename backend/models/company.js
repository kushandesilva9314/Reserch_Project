const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true, trim: true },
        companyEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
        companyPhone: { type: String, required: true, trim: true },
        ownerName: { type: String, required: true, trim: true },
        businessType: { type: String, required: true, enum: ["Startups", "SMEs", "Large Scale"] },
        companyDescription: { type: String, required: true, trim: true },
        registrationCopy: { type: String, required: true }, 
        password: { type: String, required: true },
        role: { type: String, default: "company" },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
