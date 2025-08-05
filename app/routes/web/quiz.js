import express from "express";
import {
  questionUpload,
  handleMulterError,
} from "../../http/middleware/uploadMiddleware.js";

const router = express.Router();

import quizController from "../../http/controllers/quizController.js";

// Add new Quiz
router.post("/add", quizController.addQuiz);

// Get all Quizzes
router.get("/", quizController.getAllQuizzes);

// Get a single Quiz
router.get("/:id", quizController.getQuiz);

// Update a Quiz
router.put("/:id", quizController.updateQuiz);
router.put("/:id/status", quizController.toggleStatus)

// Remove a Quiz
router.delete("/:id", quizController.removeQuiz);

// Question Routes
router.post(
  "/:id/questions/add",
  questionUpload.single("attachmentUrl"),
  handleMulterError,
  quizController.addQuestion
);

router.put(
  "/:id/questions/:questionId",
  questionUpload.single("attachmentUrl"),
  handleMulterError,
  quizController.updateQuestion
);

// Student Routes
router.get("/:id/students", quizController.getStudents);
router.post("/:id/students", quizController.addStudent);

export default router;
