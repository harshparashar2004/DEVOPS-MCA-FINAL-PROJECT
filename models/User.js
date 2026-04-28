const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving - using try/catch pattern
userSchema.pre("save", async function() {
    console.log("Pre-save hook called for password hashing");
    
    // Only hash if password is modified
    if (!this.isModified("password")) {
        console.log("Password not modified, skipping hash");
        return;
    }

    try {
        console.log("Starting password hash...");
        const salt = await bcrypt.genSalt(10);
        console.log("Salt generated");
        const hash = await bcrypt.hash(this.password, salt);
        console.log("Password hashed");
        this.password = hash;
        console.log("Password updated in document");
    } catch (error) {
        console.error("Error in pre-save hook:", error);
        throw error;
    }
});

module.exports = mongoose.model("User", userSchema);
