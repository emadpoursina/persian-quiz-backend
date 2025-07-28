import express from "express";
import adminController from "../../http/controllers/adminController.js";

const router = express.Router();

// Users
router.get("/users", adminController.getAllUsers);
router.get("/users/:userId", adminController.getUser);
router.delete("/users/:userId", adminController.removeUser);
router.put("/users/:userId", adminController.editUser);

export default router;
