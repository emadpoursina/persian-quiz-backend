import express from "express";

// Routers
import authRouter from "./auth.js";
import quizRouter from "./quiz.js";
import adminRouter from "./admin.js";
import userRouter from "./user.js";

// Middleware
import authenticationMiddleware from "../../http/middleware/authenticationMiddleware.js";
import isAdminMiddleware from "../../http/middleware/isAdminMiddleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/quiz", quizRouter);
router.use(authenticationMiddleware, isAdminMiddleware);
router.use("/admin", adminRouter);
router.use("/users", userRouter);

export default router;
