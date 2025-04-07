const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const Image = require("../models/company_images");


router.get("/uv/images/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const company = await Company.findOne({ companyEmail: email });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const images = await Image.findOne({ companyEmail: email });

        res.json({
            companyName: company.companyName || "Unknown Company",
            coverPhoto: images?.cover || null,   
            profilePhoto: images?.profile || null 
        });
    } catch (error) {
        console.error("Error fetching company images:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
