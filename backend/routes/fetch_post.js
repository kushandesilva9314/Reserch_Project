const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/post"); 
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


router.get("/user/posts", authenticate, async (req, res) => {
    try {
        const userPosts = await Post.find({ email: req.email }).sort({ createdAt: -1 });
        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
