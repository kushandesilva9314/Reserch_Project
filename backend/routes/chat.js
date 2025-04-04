const express = require("express");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const authenticate = (req, res, next) => {
    console.log("Checking token in cookies:", req.cookies);

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).json({ message: "Forbidden - Invalid token" });
        }
        req.email = decoded.email; 
        next();
    });
};


router.post("/send-message", authenticate, async (req, res) => {
    const { recipientEmail, message } = req.body;
    const senderEmail = req.email; 

    if (!recipientEmail || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const msg = {
        to: recipientEmail, 
        from: process.env.VERIFIED_EMAIL, 
        replyTo: senderEmail, 
        subject: "Investment Inquiry - Request for Investment", 
        text: message,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error.response?.body || error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

module.exports = router;
