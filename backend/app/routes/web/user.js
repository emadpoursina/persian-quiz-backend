import express from "express";
import loginController from "../../http/controllers/auth/loginController.js";
import adminController from "../../http/controllers/adminController.js";

const router = express.Router();

// /users (all users, admin only)
router.get("/", adminController.getAllUsers);

// Create a new user
router.post("/", adminController.createUser);

// Get a single user by userId
router.get("/:userId", adminController.getUser);

// Update a user by userId
router.patch("/:userId", adminController.editUser);

// Delete a user by userId
router.delete("/:userId", adminController.removeUser);

export default router;
