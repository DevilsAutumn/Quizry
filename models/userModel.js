const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Email!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
    },
    role: {
      type: Number,
      default: 0, // 0 = user , 2 = Evaluator 3 = admin
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/quizry/image/upload/v1653159606/Avatars/default-avatar_d4xidz.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
