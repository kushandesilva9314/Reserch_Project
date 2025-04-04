const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Image = require("../models/company_images");

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".jpg", ".png"];
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
            return cb(new Error("Invalid file type. Only .jpg and .png are allowed!"));
        }
        cb(null, true);
    },
});

// Middleware to authenticate and extract email from token
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
        req.email = decoded.email;
        next();
    });
};

// Upload image
router.post("/upload/:type", authenticate, upload.single("image"), async (req, res) => {
    const { type } = req.params;
    if (!["profile", "cover"].includes(type)) {
        return res.status(400).json({ message: "Invalid image type" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    let imageDoc = await Image.findOne({ companyEmail: req.email });

    if (!imageDoc) {
        imageDoc = new Image({ companyEmail: req.email });
    }

    if (imageDoc[type]) {
        return res.status(400).json({ message: `Delete existing ${type} image first` });
    }

    imageDoc[type] = imagePath;
    await imageDoc.save();

    res.status(200).json({ message: `${type} image uploaded successfully`, image: imageDoc });
});

// Delete image
router.delete("/delete/:type", authenticate, async (req, res) => {
    const { type } = req.params;
    if (!["profile", "cover"].includes(type)) {
        return res.status(400).json({ message: "Invalid image type" });
    }

    const imageDoc = await Image.findOne({ companyEmail: req.email });
    if (!imageDoc || !imageDoc[type]) {
        return res.status(404).json({ message: `${type} image not found` });
    }

    imageDoc[type] = null;
    await imageDoc.save();

    res.status(200).json({ message: `${type} image deleted successfully` });
});

// Fetch images
router.get("/images", authenticate, async (req, res) => {
    const imageDoc = await Image.findOne({ companyEmail: req.email });
    res.status(200).json(imageDoc || {});
});

module.exports = router;
