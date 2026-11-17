import { Quiz, validateQuiz } from "../../models/Quiz.js";
import fs from "fs";
import path from "path";

const quizController = {
  async addQuiz(req, res) {
    try {
      // Validate the request body before saving
      const { error, value } = validateQuiz(req.body);
      if (error) {
        // Return all validation errors
        return res.status(400).json({
          error: error.details.map((d) => d.message).join(" | "),
          details: error.details,
        });
      }

      // If valid, create and save the quiz
      const quiz = await new Quiz({
        ...value,
      }).save();

      res.status(201).json(quiz);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllQuizzes(req, res) {
    try {
      const quizzes = await Quiz.find();
      res.status(200).json(quizzes);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getQuizBySlug(req, res) {
    try {
      const { slug } = req.params;
      const quiz = await Quiz.findOne({ slug });
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Only send information necessary for a user to use the quiz
      const quizForUser = {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        isActive: quiz.isActive,
        startTime: quiz.startTime,
        endTime: quiz.endTime,
        accessType: quiz.accessType,
        allowedPhoneNumbers: quiz.allowedPhoneNumbers,
        questions: quiz.questions.map((q) => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options.map((opt) => ({
            _id: opt._id,
            text: opt.text,
            // Do not send isCorrect!
          })),
          attachmentUrl: q.attachmentUrl,
          attachmentAlt: q.attachmentAlt,
          attachmentType: q.attachmentType,
        })),
      };

      res.status(200).json(quizForUser);
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

  async updateQuiz(req, res) {
    try {
      const quizId = req.params.id;
      const updateData = req.body;

      // Check if updateData is empty
      if (
        !updateData ||
        (typeof updateData === "object" && Object.keys(updateData).length === 0)
      ) {
        return res.status(400).json({ error: "No update data provided." });
      }

      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Update the quiz fields
      Object.assign(quiz, updateData);

      // Save to trigger pre-save hooks
      await quiz.save();

      res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async toggleStatus(req, res) {
    try {
      const quizId = req.params.id;

      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Toggle the isActive field
      quiz.isActive = !quiz.isActive;

      // Save to trigger pre-save hooks
      await quiz.save();

      res.status(200).json({
        message: "Quiz status toggled successfully",
        isActive: quiz.isActive,
        quiz,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async removeQuiz(req, res) {
    try {
      const quiz = await Quiz.findByIdAndDelete(req.params.id);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });
      res.json({ message: "Quiz deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
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

  async deleteQuestion(req, res) {
    try {
      const quizId = req.params.id;
      const questionId = req.params.questionId;

      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found." });
      }

      // Find the index of the question in the quiz
      const questionIndex = quiz.questions.findIndex(
        (q) => q._id.toString() === questionId
      );
      if (questionIndex === -1) {
        return res.status(404).json({ error: "Question not found." });
      }

      const question = quiz.questions[questionIndex];

      // Remove question attachment if it's an image
      if (question.attachmentType === "image") {
        try {
          const oldAttachmentUrl = question.attachmentUrl || "";
          const urlPath = new URL(oldAttachmentUrl).pathname;
          const storagePath =
            process.env.STORAGE_PATH ||
            path.join(process.cwd(), "public", "upload");
          const relativeFilePath = urlPath.startsWith("/")
            ? urlPath.slice(1)
            : urlPath;
          const filePath = path.join(
            storagePath,
            path.basename(relativeFilePath)
          );
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Failed to remove old image:", err.message);
              }
            });
          }
        } catch (e) {
          // If oldAttachmentUrl is not a valid URL, skip deletion
        }
      }

      // Remove the question from the quiz using splice
      quiz.questions.splice(questionIndex, 1);

      await quiz.save();

      res.status(200).json({ message: "Question removed successfully.", quiz });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getStudents(req, res) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id).select("students");
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found." });
      }
      res.status(200).json(quiz.students);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async addStudent(req, res) {
    try {
      const quizId = req.params.id;
      const student = { ...req.body, answers: [] };

      // Validate input
      if (!student || typeof student !== "object") {
        return res.status(400).json({ error: "A student object is required." });
      }

      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found." });
      }

      // Validate that the number of answers matches the number of quiz questions
      if (
        !Array.isArray(student.allAnswers) ||
        student.allAnswers.length !== quiz.questions.length
      ) {
        return res.status(400).json({
          error: `Number of answers (${
            Array.isArray(student.allAnswers) ? student.allAnswers.length : 0
          }) does not match number of quiz questions (${
            quiz.questions.length
          }).`,
        });
      }

      // Calculate number fo correct answers
      let correctCount = 0;
      quiz.questions.forEach((question, idx) => {
        // Find the correct option index for this question
        const correctOptionIndex = question.options.findIndex(
          (opt) => opt.isCorrect === true
        );
        if (student.allAnswers[idx] === correctOptionIndex) {
          correctCount++;
          student.answers.push(true);
        } else {
          student.answers.push(false);
        }
      });

      // Add the new student to the quiz's students array, including score
      quiz.students.push({
        ...student,
        participateDate: new Date(),
      });

      await quiz.save();

      res.status(200).json({
        message: "Student added successfully.",
        correctAnswers: correctCount,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllStudents(req, res) {
    try {
      // Get all quizzes, only select students and createdAt
      const quizzes = await Quiz.find(
        {},
        { students: 1, createdAt: 1, _id: 1 }
      );

      // Flatten all students from all quizzes, and add quizCreatedAt to each student
      let allStudents = [];
      quizzes.forEach((quiz) => {
        if (Array.isArray(quiz.students)) {
          quiz.students.forEach((student) => {
            allStudents.push({
              ...student.toObject(),
              quizId: quiz._id,
              quizCreatedAt: quiz.createdAt,
            });
          });
        }
      });

      // Sort all students by their quiz's creation date (descending: newest first)
      allStudents.sort(
        (a, b) => new Date(b.quizCreatedAt) - new Date(a.quizCreatedAt)
      );

      // Only return the 10 latest students
      const latestStudents = allStudents.slice(0, 10);

      res.status(200).json(latestStudents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default quizController;
