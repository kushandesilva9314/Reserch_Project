const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const PendingOrg = require("../models/pending_org");
const Company = require("../models/company");

dotenv.config();

const router = express.Router();


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/approve/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to approve organization with ID: ${id}`);

        
        const pendingOrg = await PendingOrg.findById(id);
        if (!pendingOrg) {
            console.error(`Organization not found with ID: ${id}`);
            return res.status(404).json({ message: "Organization not found" });
        }

        console.log(`Organization found: ${pendingOrg.companyName}`);

       
        if (!pendingOrg.password) {
            console.error("Error: Password is missing in pending organization data.");
            return res.status(400).json({ message: "Invalid organization data (missing password)" });
        }

       
        const newCompany = new Company({
            companyName: pendingOrg.companyName,
            companyEmail: pendingOrg.companyEmail,
            companyPhone: pendingOrg.companyPhone,
            ownerName: pendingOrg.ownerName,
            businessType: pendingOrg.businessType,
            companyDescription: pendingOrg.companyDescription,
            registrationCopy: pendingOrg.registrationCopy,
            password: pendingOrg.password,  
            role: pendingOrg.role
        });

   
        await newCompany.save();
        console.log(`New company registered: ${newCompany.companyName}`);

       
        await PendingOrg.findByIdAndDelete(id);
        console.log(`Deleted pending organization with ID: ${id}`);

       
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: pendingOrg.companyEmail,
            subject: "Your Company Registration is Approved!",
            html: `
                <h2>Congratulations, ${pendingOrg.ownerName}!</h2>
                <p>Your company <strong>${pendingOrg.companyName}</strong> has been successfully registered on Investo.</p>
                <p>You can now log in to your account.</p>
                <p><a href="http://localhost:3000/login">Login Here</a></p>
                <p>Best Regards, <br> Investo Team</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Approval email sent to: ${pendingOrg.companyEmail}`);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return res.status(500).json({ message: "Company approved, but email failed to send" });
        }

        res.status(200).json({ message: "Company approved successfully and email sent" });

    } catch (error) {
        console.error("Error approving company:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
