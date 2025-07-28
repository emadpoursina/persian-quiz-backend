import express from "express";

const router = express.Router();

// Controllers
import loginController from "../../http/controllers/auth/loginController.js";

// Routes
router.post("/login", loginController.login);

export default router;
