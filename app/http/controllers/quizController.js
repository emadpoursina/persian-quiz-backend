import {
  Quiz,
  validateQuiz,
  validateQuestion,
  validateOption,
} from "../../models/Quiz.js";

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
};

export default quizController;
