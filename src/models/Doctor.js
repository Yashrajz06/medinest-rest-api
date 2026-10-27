const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Doctor name is required."], trim: true, minlength: 2, maxlength: 80 },
  specialty: { type: String, required: [true, "Specialty is required."], trim: true, minlength: 2, maxlength: 60 },
  email: {
    type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 120,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email address."]
  },
  phone: { type: String, required: true, trim: true, match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."] },
  clinic: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  consultationFee: { type: Number, required: true, min: [0, "Fee cannot be negative."], max: 100000 },
  available: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });
doctorSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("Doctor", doctorSchema);
