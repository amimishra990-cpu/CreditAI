import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/creditai";

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected:", MONGO_URI);
    } catch (err: any) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
}
