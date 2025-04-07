const express = require("express");
const router = express.Router();
const Company = require("../models/company");

router.get("/uv/details/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const company = await Company.findOne({ companyEmail: email });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json(company);
    } catch (error) {
        console.error("Error fetching company details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
