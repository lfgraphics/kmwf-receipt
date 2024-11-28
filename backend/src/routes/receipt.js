const express = require("express");
const Receipt = require("../models/Receipt");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// Create a single receipt
router.post("/create", authMiddleware(["recipient", "admin"]), async (req, res) => {
    try {
        const receipt = new Receipt(req.body);
        await receipt.save();
        res.status(201).json({ title: 'Success', message: "Receipt created successfully", receipt });
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

// Create multiple receipts
router.post("/create-bulk", authMiddleware(["recipient", "admin"]), async (req, res) => {
    try {
        const receipts = await Receipt.insertMany(req.body);
        res.status(201).json({ title: 'Success', message: "Receipts created successfully", receipts });
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

// Get a single receipt by ID
router.get("/:id", authMiddleware(["recipient", "admin"]), async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);
        if (!receipt) return res.status(404).json({ title: 'Success', message: "Receipt not found" });
        res.status(200).json(receipt);
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

// Get all receipts
router.get("/", authMiddleware(["recipient", "admin"]), async (req, res) => {
    try {
        const { usoolKuninda, startDate, endDate, name, mobile, address, mad, subsType, modeOfPayment } = req.query;

        const filters = {
            $and: [],
        };

        if (usoolKuninda) {
            filters.$and.push({
                $or: [
                    { "usoolKuninda.name": { $regex: usoolKuninda, $options: "i" } },
                    { "usoolKuninda.userid": { $regex: usoolKuninda, $options: "i" } },
                ],
            });
        }

        if (name) filters.$and.push({ name: { $regex: name, $options: "i" } });
        if (mobile) filters.$and.push({ mobile: { $regex: mobile, $options: "i" } });
        if (address) filters.$and.push({ address: { $regex: address, $options: "i" } });
        if (mad) filters.$and.push({ mad });
        if (subsType) filters.$and.push({ subsType });
        if (modeOfPayment) filters.$and.push({ modeOfPayment });

        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);

            filters.$and.push({ createdAt: dateFilter });
        }

        if (filters.$and.length === 0) delete filters.$and;

        const receipts = await Receipt.find(filters).sort({ createdAt: -1 });

        res.status(200).json(receipts);
    } catch (error) {
        res.status(400).json({ title: "Failure", error: error.message });
    }
});


// Update a single receipt by ID
router.patch("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!receipt) return res.status(404).json({ title: 'Falior', message: "Receipt not found" });
        res.status(200).json({ title: 'Success', message: "Receipt updated successfully", receipt });
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

// Delete a single receipt by ID
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        const receipt = await Receipt.findByIdAndDelete(req.params.id);
        if (!receipt) return res.status(404).json({ title: 'Falior', message: "Receipt not found" });
        res.status(200).json({ title: 'Success', message: "Receipt deleted successfully", receipt });
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

// Delete multiple receipts
router.post("/delete-bulk", authMiddleware(["admin"]), async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await Receipt.deleteMany({ _id: { $in: ids } });
        res.status(200).json({
            title: 'Success', message: `${result.deletedCount} receipts deleted successfully`,
        });
    } catch (error) {
        res.status(400).json({ title: 'Falior', error: error.message });
    }
});

module.exports = router;
