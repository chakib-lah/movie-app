import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import movieRoutes from "./routes/movies";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Middleware for parsing
app.use(express.json());
app.use(cookieParser());

// Routes (MUST come before the error handler)
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Catch errors from routes like login
app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
