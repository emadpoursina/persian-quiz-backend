import { Quiz } from "../../models/Quiz.js";
import fs from "fs";
import path from "path";

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

  async updateQuestion(req, res) {
    try {
      const quizId = req.params.id;
      const questionId = req.params.questionId;
      const newQuestion = req.body;

      // Validate input
      if (
        !newQuestion ||
        typeof newQuestion !== "object" ||
        Array.isArray(newQuestion)
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

      // Find the question in the quiz
      const question = quiz.questions.id(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      // Save old attachmentUrl for comparison and possible deletion
      const oldAttachmentUrl = question.attachmentUrl || "";

      // Handle attachmentUrl (either a single file or a single url)
      let { attachmentUrl, ...rest } = newQuestion;
      let finalAttachmentUrl = attachmentUrl || oldAttachmentUrl || "";

      // If file was uploaded, use the file path
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        finalAttachmentUrl = `${baseUrl}/upload/question/${req.file.filename}`;
      }

      // Remove old image if a new file is uploaded or the attachmentUrl is changed
      const shouldRemoveOldImage =
        (req.file && oldAttachmentUrl) ||
        (attachmentUrl && attachmentUrl !== oldAttachmentUrl);

      if (shouldRemoveOldImage && oldAttachmentUrl) {
        // Only remove if the oldAttachmentUrl is a local file (not an external URL)
        try {
          // Extract the file path from the URL
          const urlPath = new URL(oldAttachmentUrl).pathname;
          // Assuming your static files are served from process.env.STORAGE_PATH
          // and the urlPath is like /upload/question/filename.ext
          const storagePath =
            process.env.STORAGE_PATH ||
            path.join(process.cwd(), "public", "upload");
          // Remove leading slash
          const relativeFilePath = urlPath.startsWith("/")
            ? urlPath.slice(1)
            : urlPath;
          const filePath = path.join(
            storagePath,
            path.basename(relativeFilePath)
          );
          // Check if file exists before deleting
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                // Log error but don't block the response
                console.error("Failed to remove old image:", err.message);
              }
            });
          }
        } catch (e) {
          // If oldAttachmentUrl is not a valid URL, skip deletion
          // (could be a legacy value or external URL)
        }
      }

      // Update the question fields
      Object.assign(question, rest, { attachmentUrl: finalAttachmentUrl });

      await quiz.save();

      res.status(200).json({ message: "Question updated successfully.", quiz });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default quizController;
