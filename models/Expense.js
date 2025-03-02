const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  receipt: { type: String }, // Store file URL (uploaded receipts)
  voiceEntry: { type: String }, // Store text from voice input
});

module.exports = mongoose.model("Expense", ExpenseSchema);
