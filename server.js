require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const doctorRoutes = require("./src/routes/doctorRoutes");
const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.status(200).json({
  name: "MediNest REST API",
  message: "Doctor records API is running.",
  endpoints: ["GET /api/health", "GET /api/doctors", "POST /api/doctors",
    "GET /api/doctors/:id", "PUT /api/doctors/:id", "DELETE /api/doctors/:id"]
}));
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    success: connected, database: connected ? "connected" : "not connected",
    service: "MediNest REST API"
  });
});
app.use("/api/doctors", doctorRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "Endpoint not found." }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof SyntaxError && "body" in err)
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  if (err.name === "ValidationError") return res.status(400).json({
    success: false, message: "Validation failed.",
    errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
  });
  if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid record ID." });
  if (err.code === 11000) return res.status(409).json({ success: false, message: "A doctor with this email already exists." });
  res.status(500).json({ success: false, message: "Internal server error." });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Copy .env.example to .env and configure MongoDB Atlas.");
    process.exit(1);
  }
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`MediNest API listening on ${PORT}`)))
    .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
}
module.exports = app;
