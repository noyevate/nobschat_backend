import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import conversatioRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGOURL!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Mount routes
app.use("/auth", authRoutes);

app.use("/conversations", conversatioRoutes);
app.use("/messages", messageRoutes);


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
