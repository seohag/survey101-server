const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String },
  subtitle: { type: String },
  startButtonText: { type: String },
  themeColor: { type: String },
  buttonShape: { type: String },
  animation: { type: String },
  endingTitle: { type: String },
  endingContent: { type: String },
  coverImage: {
    type: Object,
    default: {
      imageUrl: "",
      imageId: "",
    },
  },
  questions: [
    {
      questionId: { type: String },
      questionType: { type: String },
      questionText: { type: String },
      options: [
        {
          optionId: { type: String },
          text: { type: String },
          image: {
            type: Object,
            default: {
              imageUrl: "",
              imageId: "",
            },
          },
        },
      ],
      answers: [
        {
          answerValue: { type: mongoose.Schema.Types.Mixed },
          createdAt: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Survey", surveySchema);
