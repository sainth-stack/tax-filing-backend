import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users/all", getAllUsers);
router.post("/users", createUser);
router.post("/users/filter", getUsers);
router.post("/users/login", loginUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserById);
export default router;
