const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({});

module.exports = mongoose.model("Questions", QuestionSchema);
