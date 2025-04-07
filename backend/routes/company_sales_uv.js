const express = require("express");
const router = express.Router();
const Sales = require("../models/sales_schema");


router.get("/company/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const salesDoc = await Sales.findOne({ email });

    if (!salesDoc) {
      return res.status(404).json({ message: "Sales data not found for this company." });
    }

    res.json({ sales: salesDoc.sales });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
