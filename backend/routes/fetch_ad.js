const express = require("express");
const jwt = require("jsonwebtoken");
const Ad = require("../models/ads");
const router = express.Router();


router.get("/public-ads", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }

    Ad.find()
      .then((ads) => {
        console.log("Fetched ads from DB:", ads);
        res.json(ads);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
});

module.exports = router;
