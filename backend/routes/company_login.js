const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/company"); 
require("dotenv").config();

const router = express.Router();


router.post("/company/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔹 Company login request received:", req.body);
        
        const company = await Company.findOne({ companyEmail: email });
        if (!company) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const token = jwt.sign(
            {
                id: company._id,
                role: company.role,
                companyName: company.companyName,
                email: company.companyEmail,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 86400000, 
        });

        res.json({
            message: "Company login successful",
            token,
            user: {
                companyName: company.companyName,
                email: company.companyEmail,
                role: company.role,
            },
        });
    } catch (error) {
        console.error("❌ Company login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/company/protected", async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden - Invalid token" });
        }

        try {
            
            const company = await Company.findOne(
                { companyEmail: decoded.email },
                "-password -registrationCopy"
            );

            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

            res.json({ 
                user: {
                    ...company.toObject(), 
                    role: company.role // Include role in response
                } 
            });
        } catch (error) {
            console.error("Error fetching company details:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
});



router.post("/company/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;
