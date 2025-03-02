const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes

// ➤ Create Expense
router.post("/", authMiddleware, async (req, res) => {
  const { amount, category, description, date } = req.body;

  // Validate input
  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Amount, category, and date are required." });
  }

  try {
    const newExpense = new Expense({ 
      user: req.user.id, 
      amount, 
      category, 
      description, 
      date 
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

// ➤ Get User's Expenses (With Pagination)
router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default pagination values

  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expense.countDocuments({ user: req.user.id });

    res.json({ expenses, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// ➤ Update Expense (Ensure Ownership)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: Cannot edit this expense." });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Error updating expense" });
  }
});

// ➤ Delete Expense (Ensure Ownership)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized: Cannot delete this expense." });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

// ✅ Approve or Reject an Expense
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    expense.status = status;
    await expense.save();

    res.json({ message: `Expense ${status}`, expense });
  } catch (error) {
    res.status(500).json({ error: "Error updating expense status" });
  }
});

// ✅ Handle Voice Input for Expense Entry
router.post("/voice", authMiddleware, async (req, res) => {
  try {
    const { voiceText } = req.body;

    // Extract amount, category, and description using AI processing (dummy logic here)
    const amount = parseFloat(voiceText.match(/\d+/)[0]); 
    const category = "General"; 
    const description = voiceText;

    const newExpense = new Expense({
      user: req.user.id,
      amount,
      category,
      description,
      voiceEntry: voiceText,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Error processing voice input" });
  }
});

module.exports = router;
