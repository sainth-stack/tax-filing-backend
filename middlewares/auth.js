import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment.js";

// Function to sign JWT tokens
export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "2d" }
  );
};

// Middleware to verify JWT token and attach user to the request
export const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  try {
    const token = authorization.split(" ")[1]; // Extract token from 'Bearer token'
    if (!token) {
      return res.status(401).json({ message: "Token missing or malformed" });
    }

    // Verify token and attach user to the request
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};
