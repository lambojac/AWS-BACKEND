const express = require("express");
const app=express()
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {connectToDb}=require("./config") 
const User=require("./schema")
app.use(express.json());
dotenv.config(); 
connectToDb();

// Signup Route
const signup= async (req, res) => {
    const { name, age, phoneNumber } = req.body;

    // Check if all required fields are provided
    if (!name || !age || !phoneNumber) {
        return res.status(400).json({ message: "Name, age, and phone number are required and compulsory" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone number and details already exists" });
        }

        // Create a new user
        const newUser = new User({ name, age, phoneNumber });
        await newUser.save(); // Save the user in the database

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

// Login Route
const login= async (req, res) => {
    const { phoneNumber } = req.body;

    // Check if phone number is provided or not
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required kindly inpyt yours phone no" });
    }

    try {
        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, phoneNumber: user.phoneNumber }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        );

        // Return the token along with user information
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
}


const server = app.listen(9000, "0.0.0.0", () => {
	console.log(`Server is running on port 9000`);
});

// Graceful shutdown
const gracefulShutdown = () => {
	console.log("Received shutdown signal, shutting down gracefully...");
	server.close((err) => {
		if (err) {
			console.error("Error during server shutdown:", err);
			process.exit(1);
		}
		console.log("Server closed successfully.");
		process.exit(0);
	});
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});


app.use("/signup",signup)
app.use("/login",login)
