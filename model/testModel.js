const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options ka array
  correctOptionIndex: { type: Number, required: true }, // 0, 1, 2, ya 3 (kaunsa option sahi hai)
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    testType: {
      type: String,
      enum: ["free", "paid"], // it can be only free or paid
      default: "free",
    },
    price: {
      type: Number,
      default: 0, // Free tests ke liye price 0 rahegi
    },
    // Ek test ke andar bohot saare questions honge, isliye array banaya
    questions: [questionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Test", testSchema);
