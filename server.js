// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoute = require("./routes/authRoutes");
// const userRoute = require("./routes/userRoute");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api", require("./routes/recipeRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

try {
  const authRoute = require("./routes/authRoutes");
  app.use("/api/auth", authRoute);
} catch (error) {
  console.error("✗ Error loading auth routes:", error.message);
  console.error("Full error:", error);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
