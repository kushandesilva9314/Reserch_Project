const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

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


const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
        req.email = decoded.email; 
        next();
    });
};


router.use("/uploads", express.static(path.join(__dirname, "../uploads")));


router.get("/user", authenticate, async (req, res) => {
    try {
        const posts = await Post.find({ email: req.email });
        res.status(200).json({ email: req.email, posts });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/add", authenticate, upload.single("image"), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }
        
        const newPost = new Post({
            title,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            email: req.email,
        });
        await newPost.save();

        res.status(201).json({ message: "Post added successfully!", post: newPost });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/all", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete("/delete/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.email;

        const post = await Post.findOne({ _id: id, email });
        if (!post) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }
        
       
        if (post.image) {
            const imagePath = path.join(__dirname, "../", post.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }
        
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;