import { Router } from "express";
import {
  getAllUsers,
  register,
  registerValidation,
  login,
  loginValidation,
  deleteUser,
  deleteAllUsers,
  updateUser,
  updateUserValidation
} from "../controllers/user.controller";

const router = Router();

// Authentication routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// User management routes
router.get("/", getAllUsers);

// Delete user
router.delete("/:id", deleteUser);

// Delete all users
router.delete("/", deleteAllUsers);

//Update user
router.put("/:id", updateUserValidation, updateUser);

export default router;
