const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios"); // ✅ Import axios for GPT-2 requests
const authRoutes = require("./routes/authRoutes");  // Ensure file exists
const expenseRoutes = require("./routes/expenseRoutes"); // Ensure file exists

require("dotenv").config(); // Load environment variables


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust if frontend URL is different
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// // Middleware
// app.use(cors()); // Allow frontend to access API
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Support form data

// Database Connection (Make sure MongoDB is running locally)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/financeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ✅ Socket.io for Real-Time Expense Updates
let expenses = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current expenses to new client
  socket.emit("expenses", expenses);

  // Add Expense
  socket.on("addExpense", (expense) => {
    expenses.push(expense);
    io.emit("expenses", expenses); // Broadcast update
  });

  // Edit Expense
  socket.on("editExpense", (updatedExpense) => {
    expenses = expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp));
    io.emit("expenses", expenses);
  });

  // Delete Expense
  socket.on("deleteExpense", (id) => {
    expenses = expenses.filter((exp) => exp.id !== id);
    io.emit("expenses", expenses);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// ✅ GPT-2 API Integration for Voice Commands
app.post("/api/voice", async (req, res) => {
  const { voiceText } = req.body;

  try {
    const gpt2Response = await axios.post("http://localhost:5001/api/gpt2", { voiceText });

    res.json({ message: gpt2Response.data.message });
  } catch (error) {
    console.error("GPT-2 Error:", error);
    res.status(500).json({ error: "Failed to process voice input" });
  }
});


// ✅ Server Listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
