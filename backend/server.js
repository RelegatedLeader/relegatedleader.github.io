const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://relegatedleader.github.io",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const accessRoutes = require("./routes/access");
const gatedAccessRoutes = require("./routes/gated-access");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/gated", gatedAccessRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Serve admin dashboard
app.use("/admin", express.static(path.join(__dirname, "./admin-dashboard")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log("\n🔐 Make sure your .env file is configured\n");
});
