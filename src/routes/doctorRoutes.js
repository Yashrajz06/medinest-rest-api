const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const router = express.Router();
const validId = id => mongoose.isValidObjectId(id);
const allowed = ["fullName", "specialty", "email", "phone", "clinic", "consultationFee", "available"];
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const unknown = Object.keys(req.body || {}).filter(k => !allowed.includes(k));
    if (unknown.length) return res.status(400).json({ success: false, message: "Unsupported fields.", fields: unknown });
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, message: "Doctor record created.", data: doctor });
  } catch (e) { next(e); }
});

// READ ALL with pagination and optional filters
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const filter = {};
    if (req.query.specialty) filter.specialty = new RegExp("^" + escapeRegex(String(req.query.specialty)) + "$", "i");
    if (req.query.available === "true") filter.available = true;
    if (req.query.available === "false") filter.available = false;
    const [data, total] = await Promise.all([
      Doctor.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Doctor.countDocuments(filter)
    ]);
    res.status(200).json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid doctor ID." });
    const data = await Doctor.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Doctor record not found." });
    res.status(200).json({ success: true, data });
  } catch (e) { next(e); }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid doctor ID." });
    const unknown = Object.keys(req.body || {}).filter(k => !allowed.includes(k));
    if (unknown.length) return res.status(400).json({ success: false, message: "Unsupported fields.", fields: unknown });
    const data = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: "Doctor record not found." });
    res.status(200).json({ success: true, message: "Doctor record updated.", data });
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid doctor ID." });
    const data = await Doctor.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Doctor record not found." });
    res.status(200).json({ success: true, message: "Doctor record deleted.", data: { id: data._id } });
  } catch (e) { next(e); }
});
module.exports = router;
