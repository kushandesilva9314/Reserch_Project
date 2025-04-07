const express = require("express");
const router = express.Router();
const Post = require("../models/post");


router.get("/company/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const posts = await Post.find({ email }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts by email:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
