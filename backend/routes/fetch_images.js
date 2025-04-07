
const express = require("express");
const jwt = require("jsonwebtoken");
const Image = require("../models/company_images");
const router = express.Router();


const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
        req.email = decoded.email; 
        next();
    });
};


router.get("/user/images", authenticate, async (req, res) => {
    try {
        const userImages = await Image.findOne({ companyEmail: req.email });
        if (!userImages) return res.status(404).json({ message: "Images not found" });

        res.status(200).json(userImages);
    } catch (error) {
        console.error("Error fetching user images:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router