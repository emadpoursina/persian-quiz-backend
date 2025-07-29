import {
  Quiz,
  validateQuiz,
  validateQuestion,
  validateOption,
} from "../../models/Quiz.js";

const quizController = {
  async addQuiz(req, res) {
    res.send("addQuiz");
  },
};

export default quizController;
