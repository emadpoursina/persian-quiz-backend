import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// Joi validation schema
export const UserJoiSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().trim(),
  phone: Joi.string()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a corroct phone number",
    }),
  password: Joi.string().min(3).max(1024).required(),
  role: Joi.string().valid("user", "admin").default("user"),
  avatar: Joi.string().uri().optional(),
  isActive: Joi.boolean().default(true),
});

// Validation function
export const validateUser = (userData) => {
  return UserJoiSchema.validate(userData);
};

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^09\d{9}$/,
        "Phone number must start with 09 and be 10 digits long",
      ],
      unique: true, // Consider adding if phone numbers should be unique
      trim: true,
    },
    password: { type: String, minLength: 3, maxLength: 1024, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      match: [/^https?:\/\/.+/, "Please use a valid URL."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// User Schema methods
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

UserSchema.plugin(mongoosePaginate);

export default mongoose.model("User", UserSchema);
