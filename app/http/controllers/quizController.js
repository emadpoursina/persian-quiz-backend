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

  async addQuestion(req, res) {
    try {
      const quizId = req.params.id;
      const question = req.body;

      // Validate input
      if (
        !question ||
        typeof question !== "object" ||
        Array.isArray(question)
      ) {
        return res
          .status(400)
          .json({ error: "A question object is required." });
      }

      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found." });
      }

      // Handle attachmentUrl (either a single file or a single url)
      let { attachmentUrl, ...rest } = question;
      let finalAttachmentUrl = attachmentUrl || "";

      // If file was uploaded, use the file path
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        finalAttachmentUrl = `${baseUrl}/upload/question/${req.file.filename}`;
      }

      // Add the new question to the quiz's questions array
      quiz.questions.push({
        ...rest,
        attachmentUrl: finalAttachmentUrl,
      });

      await quiz.save();

      res.status(200).json({ message: "Question added successfully.", quiz });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default quizController;
