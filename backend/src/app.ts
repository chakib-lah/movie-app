import express from "express";
import mongoose from "mongoose";

import movieRoutes from "./routes/movies";

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/movie-app")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use(express.json());

app.use("/api/movies", movieRoutes);

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
