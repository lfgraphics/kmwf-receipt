const mongoose = require("mongoose");
const moment = require("moment-timezone");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, required: true, unique: true },
  pas: { type: String, required: true },
  role: { type: String, enum: ["recipient", "tester", "admin", "user"], default: "user" }, // Define roles
  verified:{ type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
});

module.exports = mongoose.model("User", UserSchema);
