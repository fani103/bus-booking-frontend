const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't call process.exit(1) on Vercel — it crashes the function
    throw error;
  }
}

module.exports = connectDB;