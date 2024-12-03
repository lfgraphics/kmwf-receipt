const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Counter Schema to track the highest value
const CounterSchema = new mongoose.Schema({
    modelName: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

// Receipt Schema
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
    receiptNumber: { type: Number, unique: true }, // Self-incrementing field
});

// Pre-save hook for auto-increment
ReceiptSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            // Increment the counter
            const counter = await Counter.findOneAndUpdate(
                { modelName: "Receipt" }, // Filter
                { $inc: { seq: 1 } }, // Update
                { new: true, upsert: true } // Options: return updated doc, create if not exists
            );
            this.receiptNumber = counter.seq; // Assign the incremented value
        } catch (error) {
            return next(error); // Pass any error to the next middleware
        }
    }
    next();
});

const Receipt = mongoose.model("Receipt", ReceiptSchema);

module.exports = { Receipt, Counter };
