import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// Joi validation schema
export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().trim(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(3).max(1024).required(),
  role: Joi.string().valid("user", "admin").default("user"),
  avatar: Joi.string().uri().optional(),
  isActive: Joi.boolean().default(true),
  joinDate: Joi.date().required(),
});

// Validation function
export const validateUser = (userData) => {
  return userValidationSchema.validate(userData);
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      maxlength: 255,
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
    joinDate: {
      type: Date,
      required: true,
    },
    numberId: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.numberId = await Counter.getNextSequence("numberId");
  }
  next();
});

// User Schema methods
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function (password) {
  let salt = bcrypt.genSaltSync(15);
  let hash = bcrypt.hashSync(password, salt);

  return hash;
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
