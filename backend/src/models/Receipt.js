const mongoose = require("mongoose");
const moment = require("moment-timezone");

const ReceiptSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: false },
    mad: { type: String, enum: ["Zakat", "Sadqa"], required: true },
    subsType: { type: String, enum: ["Mahana", "Salana"], required: true },
    modeOfPayment: { type: String, enum: ["Online", "Cash"], required: true },
    paymentProof: {
        type: String,
        required: function () {
            return this.modeOfPayment === "Online";
        },
    },
    usoolKuninda: {
        name: { type: String, required: true },
        userid: { type: String, required: true },
        phoneNo: { type: String, required: true },
    },
    createdAt: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
