const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true},
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "investor" },
    governmentId: { type: String },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


const PendingUser = mongoose.model("PendingUser", userSchema, "pending_users");

module.exports = PendingUser;
