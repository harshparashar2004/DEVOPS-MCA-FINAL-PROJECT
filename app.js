require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const app = express();

// Temporary in-memory storage for when MongoDB is not connected
let inMemoryUsers = [];
let mongoConnected = false;


// ================================
// MongoDB Connection
// ================================
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/devopsdb";

console.log("Connecting to MongoDB...");
mongoose.connect(mongoURI)
.then(() => {
    console.log("MongoDB Connected 🚀");
    mongoConnected = true;
})
.catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    console.error(
        "If you are using MongoDB Atlas, make sure your current IP address is whitelisted."
    );
    console.error(
        "If you want a local fallback for testing, run MongoDB locally or update MONGODB_URI."
    );
    console.log("Running in offline mode (in-memory storage)");
    mongoConnected = false;
});


// ================================
// Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================================
// Test POST Route (moved to top)
// ================================
app.post("/test", (req, res) => {
    console.log("=== TEST POST ROUTE CALLED ===");
    res.json({ message: "Test POST works", body: req.body });
});


// ================================
// Home Route
// ================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ================================
// Register Page Route
// ================================
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});


// ================================
// Register User Route (POST)
// ================================
app.post("/register", async (req, res) => {
    console.log("=== REGISTER ROUTE CALLED - NEW VERSION ===");
    console.log("Request body:", req.body);
    try {
        console.log("Registration request received:", req.body);

        const { fullName, email, password, confirmPassword } = req.body;

        // Basic validation
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // If MongoDB is not connected, use a temporary in-memory fallback for testing
        if (!mongoConnected) {
            const existingUser = inMemoryUsers.find(
                (user) => user.email === email.toLowerCase()
            );

            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "User with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            inMemoryUsers.push({
                fullName: fullName.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                createdAt: new Date(),
            });

            console.warn(
                "Saved user in offline mode. MongoDB is not connected, so data will not persist after restart."
            );

            return res.status(201).json({
                message:
                    "Registration successful in offline mode. Connect to MongoDB to persist data permanently.",
            });
        }

        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create new user
        const newUser = new User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: password, // Will be hashed by the pre-save hook
        });

        // Save user to database
        await newUser.save();

        console.log("User registered successfully:", newUser.email);
        res.status(201).json({
            message: "Registration successful — welcome to HARSH DEVOPS SOLUTIONS!",
        });
    } catch (error) {
        console.error("Registration error details:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "An error occurred during registration" });
    }
});


// ================================
// Serve Static Files (moved to bottom)
// ================================
app.use(express.static(path.join(__dirname)));

// 404 Fallback for all unmatched requests
app.use((req, res) => {
    console.log(`Unmatched request: ${req.method} ${req.path}`);
    res.status(404).json({ message: "Not Found" });
});

// ================================
// Start Server
// ================================
app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
    console.log("Open your browser at http://localhost:3000");
});