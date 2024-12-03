const mongoose = require("mongoose");
const moment = require("moment-timezone");

const ReceiptSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: false },
    amount: { type: Number, required: true },
    amountInWords: { type: String, required: true },
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
        id: { type: mongoose.Schema.Types.ObjectId },
        phoneNo: { type: String, required: true },
    },
    createdAt: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
