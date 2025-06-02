const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PendingOrgSchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true, trim: true },
        companyEmail: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], 
        },
        companyPhone: { 
            type: String, 
            required: true, 
            trim: true,
            match: [/^\+?[0-9 ]{7,20}$/, "Please enter a valid phone number"]          
        },
        ownerName: { type: String, required: true, trim: true },
        businessType: { 
            type: String, 
            required: true,
            enum: ["Startups", "SMEs", "Large Scale"], 
        },
        companyDescription: { type: String, required: true, trim: true },
        registrationCopy: { 
            type: String, 
            required: true,
        }, 
        password: { 
            type: String, 
            required: true,
            minlength: [6, "Password must be at least 6 characters long"], 
        },
        role: { 
            type: String, 
            default: "company",  
        },
    },
    { timestamps: true }
);


PendingOrgSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(12); 
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const PendingOrg = mongoose.model("PendingOrg", PendingOrgSchema);
module.exports = PendingOrg;
