import express from "express";

const router = express.Router();

import quizController from "../../http/controllers/quizController.js";

router.post("/add", quizController.addQuiz);

export default router;
