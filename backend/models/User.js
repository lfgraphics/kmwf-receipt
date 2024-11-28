const mongoose = require("mongoose");
const moment = require("moment-timezone");

const UserSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNo: { type: String, required: true, unique: true },
  pas: { type: String, required: true },
  createdAt: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
});

module.exports = mongoose.model("User", UserSchema);
