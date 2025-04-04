const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const ProfilePicture = require("../models/profile");

const router = express.Router();

// Ensure uploads folder and default image exist
const uploadDir = path.join(__dirname, "..", "uploads");
const defaultProfilePath = "/uploads/default-profile.png";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files (profile images)
router.use("/uploads", express.static(uploadDir));

// Multer storage setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload profile picture
router.post("/upload", upload.single("profileImage"), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Find existing profile picture and delete it
    const existingImage = await ProfilePicture.findOne({ email });
    if (existingImage && existingImage.imageUrl !== defaultProfilePath) {
      const oldImagePath = path.join(__dirname, "..", existingImage.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update or create profile picture entry
    await ProfilePicture.findOneAndUpdate(
      { email },
      { imageUrl },
      { upsert: true, new: true }
    );

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get profile picture
router.get("/get", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const profilePicture = await ProfilePicture.findOne({ email });

    let imageUrl;
    if (profilePicture && profilePicture.imageUrl) {
      imageUrl = profilePicture.imageUrl;
    } else {
      imageUrl = defaultProfilePath; // Use default image if no profile picture
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
