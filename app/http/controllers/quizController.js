import { Quiz } from "../../models/Quiz.js";

const quizController = {
  async addQuiz(req, res) {
    try {
      const task = await new Quiz({
        ...req.body,
      }).save();

      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getQuiz(req, res) {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.status(200).json(quiz);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async setQuestions(req, res) {
    try {
      const quizId = req.params.id;
      const questions = req.body;

      // Validate input
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Questions array is required." });
      }

      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found." });
      }

      // Assign questions and save
      quiz.questions = questions;
      await quiz.save();

      res
        .status(200)
        .json({ message: "Questions updated successfully.", quiz });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default quizController;
