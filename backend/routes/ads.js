const express = require("express");
const jwt = require("jsonwebtoken");
const Ad = require("../models/ads");
const Company = require("../models/company"); 

const router = express.Router();


const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findOne({ companyEmail: decoded.email });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        req.company = company; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
};


router.post("/ads", verifyToken, async (req, res) => {
    const { investment, percentage, description } = req.body;

    if (!investment || !percentage || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newAd = new Ad({
            investment,
            percentage,
            description,
            companyEmail: req.company.companyEmail,
            companyName: req.company.companyName,
            businessType: req.company.businessType,
        });

        await newAd.save();
        res.status(201).json({ message: "Ad created successfully", ad: newAd });
    } catch (error) {
        console.error("Error creating ad:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/ads", verifyToken, async (req, res) => {
    try {
        const ads = await Ad.find({ companyEmail: req.company.companyEmail });
        res.json(ads);
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete("/ads/:id", verifyToken, async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        if (ad.companyEmail !== req.company.companyEmail) {
            return res.status(403).json({ message: "Unauthorized to delete this ad" });
        }

        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: "Ad deleted successfully" });
    } catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
