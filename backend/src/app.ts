import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import movieRoutes from "./routes/movies";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Skip DB connection if in test environment
if (process.env.NODE_ENV !== "test") {
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
}

app.use(
  cors({
    origin: process.env.FRONT_URI,
    credentials: true,
  })
);

// Middleware for parsing
app.use(express.json());
app.use(cookieParser());

// Routes (MUST come before the error handler)
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Catch errors from routes like login
app.use(errorHandler);

export default app;
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
