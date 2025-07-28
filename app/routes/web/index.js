import express from "express";

// Routers
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import userRouter from "./user.js";

// Middleware
import authenticateMiddleware from "../../http/middleware/authenticateMiddleware.js";
import isAdminMiddleware from "../../http/middleware/isAdminMiddleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use(authenticateMiddleware, isAdminMiddleware);
router.use("/admin", adminRouter);
router.use("/users", userRouter);

export default router;
