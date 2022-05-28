const mongoose = require("mongoose");

const ContributorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  totalcontribution: {
    type: Number,
  },
  accepted: {
    type: Number,
  },
  declined: {
    type: Number,
  },
  pending: {
    type: Number,
  },
});

module.exports = mongoose.model("Contributors", ContributorSchema);
