const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    difficulty: {
      type: String,
    },
    question: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
    },
    options: {
      type: Array,
      required: true,
    },
    correct_option: {
      type: String,
      required: [true, "Please enter a correct answer."],
    },
    posted_by_id: {
      type: String,
    },
    posted_by_name: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questions", QuestionSchema);
