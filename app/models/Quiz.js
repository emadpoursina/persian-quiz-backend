import mongoose from "mongoose";
import Joi from "joi";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;

// Option Schema (embedded in Question)
const OptionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Question Schema (embedded in Quiz)
const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [OptionSchema],
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: (props) =>
        `A question must have exactly 4 options, got ${props.value.length}`,
    },
    required: true,
  },
  attachmentUrl: { type: String, default: "" },
  attachmentAlt: { type: String, default: "" },
  attachmentType: {
    type: String,
    enum: ["image", "video", "none"],
    default: "none",
  },
});

// Student Schema (embedded in Quiz)
const StudentSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  participateDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  answers: {
    type: [Boolean],
    required: true,
    validate: {
      validator: function (v) {
        // This will be validated against the number of questions in the quiz
        return (
          Array.isArray(v) && v.every((answer) => typeof answer === "boolean")
        );
      },
      message: "Answers must be an array of booleans",
    },
  },
});

// Quiz Schema
const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    students: {
      type: [StudentSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    timeLimit: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 70,
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: false,
    },
    accessType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      required: true,
    },
    allowedPhoneNumbers: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          // Only validate if accessType is private
          if (this.accessType === "private") {
            return Array.isArray(v) && v.length > 0;
          }
          return true;
        },
        message: "برای دسترسی خصوصی، حداقل یک شماره تلفن باید تعریف شود.",
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to validate and format
quizSchema.pre("save", function (next) {
  // Validate that exactly one option is correct for each question
  for (const question of this.questions) {
    const correctOptions = question.options.filter(
      (opt) => opt.isCorrect
    ).length;
    if (correctOptions !== 1) {
      return next(
        new Error(
          `هر سوال باید تنها یک جواب  صحیح داشته باشد. سوال ${question.questionText} دارای ${correctOptions} جواب صحیح است.`
        )
      );
    }
  }

  // Format slug
  if (this.slug) {
    let formatted = this.slug
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, "") // Remove invalid characters
      .replace(/--+/g, "-") // Replace multiple hyphens with one
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
    this.slug = formatted;
  }

  // Fix start and end time format from second to milisecond
  if (this.startTime) {
    this.startTime = this.startTime * 1000;
  }
  if (this.endTime) {
    this.endTime = this.endTime * 1000;
  }
  next();
});

// Add pagination plugin
quizSchema.plugin(mongoosePaginate);

const Quiz = mongoose.model("Quiz", quizSchema);

// Joi Validation Schemas
const optionValidationSchema = Joi.object({
  text: Joi.string().required().messages({
    "string.empty": "جواب نمیتواند خالی  باشد.",
    "any.required": "جواب نمیتواند خالی  باشد.",
  }),
  isCorrect: Joi.boolean().required().messages({
    "boolean.base": "یک جواب صحیح درست وارد کنید.",
    "any.required": "حداقل یک جواب صحیح وارد کنید.",
  }),
});

const questionValidationSchema = Joi.object({
  questionText: Joi.string().required().messages({
    "string.empty": "سوال نمیتواند خالی باشد.",
    "any.required": "سوال نمیتواند متن نداشته باشد.",
  }),
  options: Joi.array()
    .items(optionValidationSchema)
    .length(4)
    .required()
    .messages({
      "array.base": "Options must be an array",
      "array.length": "Exactly 4 options are required",
      "any.required": "Options are required",
    }),
  explanation: Joi.string().allow("").optional(),
})
  .custom((value, helpers) => {
    const correctOptions = value.options.filter((opt) => opt.isCorrect).length;
    if (correctOptions !== 1) {
      return helpers.error("any.invalid");
    }
    return value;
  })
  .messages({
    "any.invalid": "Each question must have exactly one correct option",
  });

const studentValidationSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "string.empty": "Full name cannot be empty",
    "any.required": "Full name is required",
  }),
  phoneNumber: Joi.string().trim().required().messages({
    "string.empty": "Phone number cannot be empty",
    "any.required": "Phone number is required",
  }),
  participateDate: Joi.date().default(Date.now).messages({
    "date.base": "Participate date must be a valid date",
  }),
  answers: Joi.array().items(Joi.boolean()).required().messages({
    "array.base": "Answers must be an array",
    "any.required": "Answers are required",
  }),
});

const quizValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),
  slug: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .messages({
      "string.empty": "Slug cannot be empty",
      "any.required": "Slug is required",
      "string.pattern.base": "Slug format is incorrect",
    }),
  description: Joi.string().allow("").optional(),
  questions: Joi.array()
    .items(questionValidationSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Questions must be an array",
      "array.min": "At least one question is required",
      "any.required": "Questions are required",
    }),
  students: Joi.array().items(studentValidationSchema).default([]).messages({
    "array.base": "Students must be an array",
  }),
  isActive: Joi.boolean().default(false),
  timeLimit: Joi.number().integer().min(0).default(0),
  passingScore: Joi.number().integer().min(0).max(100).default(70),
  startTime: Joi.date().optional().messages({
    "date.base": "Start time must be a valid date",
  }),
  endTime: Joi.date().optional().messages({
    "date.base": "End time must be a valid date",
  }),
  accessType: Joi.string()
    .valid("public", "private")
    .default("public")
    .required()
    .messages({
      "string.empty": "نوع دسترسی نمی‌تواند خالی باشد.",
      "any.required": "نوع دسترسی الزامی است.",
      "any.only": "نوع دسترسی باید public یا private باشد.",
    }),
  allowedPhoneNumbers: Joi.array().items(Joi.string()).default([]).messages({
    "array.base": "شماره‌های تلفن مجاز باید آرایه‌ای از رشته‌ها باشند.",
  }),
})
  .custom((value, helpers) => {
    // Validate start time is before end time
    if (value.startTime && value.endTime) {
      if (value.startTime >= value.endTime) {
        return helpers.error("any.invalid");
      }
    }

    // Validate that private access has at least one phone number
    if (value.accessType === "private") {
      if (
        !value.allowedPhoneNumbers ||
        value.allowedPhoneNumbers.length === 0
      ) {
        return helpers.error("any.private_access");
      }
    }

    return value;
  })
  .messages({
    "any.invalid": "زمان شروع باید قبل از زمان پایان باشد.",
    "any.private_access":
      "برای دسترسی خصوصی، حداقل یک شماره تلفن باید تعریف شود.",
  });

// Validation functions
function validateQuiz(quiz) {
  return quizValidationSchema.validate(quiz, { abortEarly: false });
}

function validateQuestion(question) {
  return questionValidationSchema.validate(question, { abortEarly: false });
}

function validateOption(option) {
  return optionValidationSchema.validate(option, { abortEarly: false });
}

function validateStudent(student) {
  return studentValidationSchema.validate(student, {
    abortEarly: false,
  });
}

export {
  Quiz,
  validateQuiz,
  validateQuestion,
  validateOption,
  validateStudent,
};
