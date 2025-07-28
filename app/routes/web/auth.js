import express from "express";

const router = express.Router();

// Controllers
import loginController from "../../http/controllers/auth/loginController.js";
import registerController from "../../http/controllers/auth/registerController.js";

// Routes
router.post("/login", loginController.login);
router.post("/register", registerController.register);

export default router;
