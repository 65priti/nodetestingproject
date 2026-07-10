const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    // Array of objects: User ne jitne test diye hain unka record yahan rahega
    testAttempts: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId, // Test ki unique ID se map hoga
          ref: "Test",
        },
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        attemptedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;