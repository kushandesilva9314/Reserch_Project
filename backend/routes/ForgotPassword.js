const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Investor = require("../models/investors");
const Company = require("../models/company");
require("dotenv").config();

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const otpStore = {};


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post("/forgot-password", async (req, res) => {
  const { email, role } = req.body;
  const normalizedEmail = email.toLowerCase(); 
  const query = role === "company" ? { companyEmail: normalizedEmail } : { email: normalizedEmail };

  try {
    const user = await (role === "company" ? Company : Investor).findOne(query);
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    otpStore[normalizedEmail] = otp; 

    console.log(`OTP for ${normalizedEmail}:`, otp); 

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase();

  if (!otpStore[normalizedEmail]) {
    return res.status(400).json({ message: "No OTP found for this email. Request a new one." });
  }

  if (otpStore[normalizedEmail] !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  
  delete otpStore[normalizedEmail];

  res.status(200).json({ message: "OTP verified successfully" });
});


router.post("/reset-password", async (req, res) => {
  const { email, newPassword, role } = req.body;
  const normalizedEmail = email.toLowerCase();
  const query = role === "company" ? { companyEmail: normalizedEmail } : { email: normalizedEmail };

  try {
    const user = await (role === "company" ? Company : Investor).findOne(query);
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
