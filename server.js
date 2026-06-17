const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Logger Middleware
const logger = require("./middleware/logger");
app.use(logger);

// Routes
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("Database Connection Error:");
    console.log(error.message);
  });

// Invalid Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });

});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server Running On Port ${PORT}`);
// });
// For Vercel
module.exports = app;