const express = require("express");
const multer = require("multer");
const path = require("path");
const PendingOrg = require("../models/pending_org"); 

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: "./uploads/", // Ensure the 'uploads' folder exists and is writable
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Add fileFilter for validating file types (only image types allowed)
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".jpg", ".png"];
        const fileExt = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            return cb(new Error("Invalid file type. Only .jpg and .png images are allowed!"));
        }
        cb(null, true); // Accept file if valid
    },
});



// Serve the 'uploads' folder as static files
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post("/register", upload.single("registrationCopy"), async (req, res) => {
    try {
        const { companyName, companyEmail, companyPhone, ownerName, businessType, companyDescription, password } = req.body;
        const registrationCopy = req.file ? `/uploads/${req.file.filename}` : null;


        if (!companyName || !companyEmail || !companyPhone || !ownerName || !businessType || !companyDescription || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!registrationCopy) {
            return res.status(400).json({ message: "Registration copy is required!" });
        }

        const existingCompany = await PendingOrg.findOne({ companyEmail });
        if (existingCompany) {
            return res.status(400).json({ message: "A company with this email already exists!" });
        }

        const newPendingOrg = new PendingOrg({
            companyName,
            companyEmail,
            companyPhone,
            ownerName,
            businessType,
            companyDescription,
            password,
            registrationCopy,
        });

        await newPendingOrg.save();
        res.status(201).json({ message: "Company registered successfully! Your application is under review." });
    } catch (error) {
        console.error("Error registering company:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
