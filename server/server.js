const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Core middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded property images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route (Prevents "Route not found - /" on Render)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Real Estate Portal API is running...",
    status: "active",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Real Estate Portal API is running" });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Error handling middleware (Must stay last)
app.use(notFound);
app.use(errorHandler);

// Listen on Render dynamic port or fallback to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});