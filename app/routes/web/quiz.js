import express from "express";
import {
  questionUpload,
  handleMulterError,
} from "../../http/middleware/uploadMiddleware.js";

const router = express.Router();

// Controllers
import quizController from "../../http/controllers/quizController.js";

// Middlewares
import authenticationMiddleware from "../../http/middleware/authenticationMiddleware.js";

// Get all Quizzes
router.get("/", quizController.getAllQuizzes);

// Get a quiz using slug
router.get("/:slug", quizController.getQuizBySlug);

// Get a quiz using id
router.get("/id/:id", quizController.getQuiz);

// Authentication Middleware
router.use(authenticationMiddleware);

// Add new Quiz
router.post("/add", quizController.addQuiz);

// Update a Quiz
router.put("/:id", quizController.updateQuiz);
// Toggle status of a quiz
router.put("/:id/status", quizController.toggleStatus);

// Remove a Quiz
router.delete("/:id", quizController.removeQuiz);

// Question Routes

// Add Question to a quiz
router.post(
  "/:id/questions/add",
  questionUpload.single("attachmentUrl"),
  handleMulterError,
  quizController.addQuestion
);

// Update Question of a quiz
router.put(
  "/:id/questions/:questionId",
  questionUpload.single("attachmentUrl"),
  handleMulterError,
  quizController.updateQuestion
);

// Student Routes
// Add student to a quiz
router.post("/:id/students", quizController.addStudent);

// Get all students of a quiz
router.get("/:id/students", quizController.getStudents);

export default router;
