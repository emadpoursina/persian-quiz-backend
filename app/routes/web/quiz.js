import express from "express";

const router = express.Router();

import quizController from "../../http/controllers/quizController.js";

// Add new Quiz
router.post("/add", quizController.addQuiz);

// Get a single Quiz
router.get("/:id", quizController.getQuiz);

// Question Routes
router.post("/:id/questions/add", quizController.addQuestion);

export default router;
