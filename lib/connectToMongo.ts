import mongoose from "mongoose";

// Establish MongoDB connection
export async function connectToMongo(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit process if DB connection fails
  }
}
