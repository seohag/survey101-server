const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema({
  title: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Survey", SurveySchema);
