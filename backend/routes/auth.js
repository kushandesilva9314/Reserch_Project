const express = require("express");
const multer = require("multer");
const path = require("path");
const PendingUser = require("../models/pending_user"); 


const router = express.Router();


const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });


router.post("/register", upload.single("governmentId"), async (req, res) => {
    try {
        const { fullName, email, phoneNumber, username, password, address } = req.body;
        const governmentId = req.file ? `/uploads/${req.file.filename}` : null; // Store URL path

        if (!fullName || !email || !phoneNumber || !username || !password || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await PendingUser.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "An investor with this email or username already exists." });
        }

        const newPendingUser = new PendingUser({
            fullName,
            email,
            phoneNumber,
            username,
            password,
            address,
            governmentId,
        });

        await newPendingUser.save();
        res.status(201).json({ message: "User registered successfully! Your application is under review." });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;

