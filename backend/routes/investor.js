const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PendingUser = require("../models/pending_user");
const Investor = require("../models/investors");

dotenv.config();

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/approve/:id", async (req, res) => {
    try {
        const investorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(investorId)) {
            console.error("Invalid ObjectId:", investorId);
            return res.status(400).json({ message: "Invalid investor ID format" });
        }

        console.log("Attempting to approve investor with ID:", investorId);

       
        const pendingInvestor = await PendingUser.findById(investorId);
        if (!pendingInvestor) {
            console.error("Investor not found with ID:", investorId);
            return res.status(404).json({ message: "Investor not found" });
        }

        console.log("Pending investor found:", pendingInvestor);

      
        const newInvestor = new Investor({
            fullName: pendingInvestor.fullName,
            email: pendingInvestor.email,
            phoneNumber: pendingInvestor.phoneNumber,
            username: pendingInvestor.username,
            password: pendingInvestor.password, 
            address: pendingInvestor.address,
            role: pendingInvestor.role,
            governmentId: pendingInvestor.governmentId
        });

        console.log("Saving new investor...");
        await newInvestor.save();

      
        await PendingUser.findByIdAndDelete(investorId);
        console.log("Deleted pending investor with ID:", investorId);

       
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: pendingInvestor.email,
            subject: "Your Investo Registration is Approved!",
            html: `
                <h2>Welcome, ${pendingInvestor.fullName}!</h2>
                <p>Congratulations! Your registration as an investor on Investo has been approved.</p>
                <p>You can now log in to your account and start investing.</p>
                <p><a href="http://localhost:3000/login">Login Here</a></p>
                <p>Best Regards, <br> Investo Team</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Approval email sent to:", pendingInvestor.email);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res.status(500).json({ message: "Investor approved, but email failed to send" });
        }

        res.status(200).json({ message: "Investor approved successfully and email sent" });

    } catch (error) {
        console.error("Error approving investor:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
