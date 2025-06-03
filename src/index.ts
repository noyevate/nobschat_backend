// // src/index.ts
// import express, { Request, Response } from 'express';
// import { json } from 'body-parser';
// const mongoose = require('mongoose');
// const dotenv = require('dotenv')
// import  authRoutes  from './routes/authRoutes'; // adjust path if needed


// dotenv.config();

// const app = express();
// app.use(json());

// mongoose.connect(process.env.MONGOURL).then(() => {
//     console.log("chopnow backend connected to mongoDb database!")
// }).catch((err: any) =>{console.log(err)})

// app.use('/auth', authRoutes);

// app.get('/test', (req: Request, res: Response) => {
//   res.send('Hello world');
// });

// const PORT = process.env.PORT || 3500;
// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
// });


// src/index.ts
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGOURL!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Mount routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
