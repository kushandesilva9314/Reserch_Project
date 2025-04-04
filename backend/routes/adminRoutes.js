const express = require("express");
const Company = require("../models/company");
const Investor = require("../models/investors");
const Ad = require("../models/ads");

const router = express.Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();
    const totalInvestors = Math.max(0, (await Investor.countDocuments()) - 1);
    const totalAds = await Ad.countDocuments();

    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 29); 

    const adsOverTime = await Ad.aggregate([
      {
        $match: {
          createdAt: {
            $gte: past30Days,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          adsCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      totalCompanies,
      totalInvestors,
      totalAds,
      adsOverTime,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
