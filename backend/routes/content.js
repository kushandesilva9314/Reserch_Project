const express = require("express");
const multer = require("multer");
const path = require("path");
const Content = require("../models/content"); 

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
        const allowedTypes = [".jpg", ".jpeg", ".png"];
        if (!allowedTypes.includes(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed!"));
        }
        cb(null, true);
    },
});


router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const newContent = new Content({ title, description, image: imagePath });
        await newContent.save();

        res.status(201).json({ message: "Content added successfully!", content: newContent });
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/all", async (req, res) => {
    try {
        const contents = await Content.find();
        res.status(200).json(contents);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContent = await Content.findByIdAndDelete(id);

        if (!deletedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
