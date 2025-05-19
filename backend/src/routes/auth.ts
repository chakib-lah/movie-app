import { Router } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../validators/user.validator";
import { authenticate } from "../middleware/auth";

const router = Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET || "fallbackAccessSecret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "fallbackRefreshSecret";

const isProduction = process.env.NODE_ENV === "production";

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registred" });
  } catch (error) {
    next(error);
  }
});

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "1m" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //   const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // set to true in production (HTTPS)
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

// Refresh
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { userId: string };
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

//Logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
});

router.get("/me", authenticate, async (req, res) => {
  const userId = (req as any).user.userId;
  const user = await User.findById(userId).select("-password"); // hide password
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;
