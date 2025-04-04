const express = require("express");
const axios = require("axios");
const router = express.Router();

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = "d23c22e5846b44d38b2ba7acd1688ed0"; 

router.get("/market-news", async (req, res) => {
  try {
    const response = await axios.get(`${NEWS_API_URL}?category=business&language=en&apiKey=${API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching market news:", error);
    res.status(500).json({ message: "Error fetching market news" });
  }
});

module.exports = router;
