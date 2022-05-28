const mongoose = require("mongoose");

const EvaluatedQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    difficulty: {
      type: String,
    },
    question: {
      type: String,
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
      required: [true, "Please enter correct option."],
    },
    posted_by_id: {
      type: String,
    },
    posted_by_name: {
      type: String,
    },
    evaluated_by: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApprovedQuestions", EvaluatedQuestionSchema);
