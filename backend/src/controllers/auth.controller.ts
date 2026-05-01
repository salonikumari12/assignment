import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Only the 'admin1' account gets admin rights. Everyone else is a member.
    const role = email.toLowerCase() === "admin1" ? "admin" : "member";

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id.toString());

    res.status(201).json({ token, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[register error]", message);
    res.status(500).json({ message: "Server error", detail: message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken(user._id.toString());
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json(req.user);
};
