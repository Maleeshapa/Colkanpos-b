const Stock = require("../model/Stock");
const StockPayment = require("../model/StockPayment");
const Supplier = require("../model/Supplier");

async function createStockPayment(req, res) {
    try {
        const { cashAmount, chequeAmount, due, vat, total, stockQty, supplierId } = req.body;

        // Basic input validation
        if (cashAmount === undefined || chequeAmount === undefined || due === undefined) {
            return res.status(400).json({ error: "Missing payment amounts." });
        }

        if (total === undefined || total <= 0) {
            return res.status(400).json({ error: "Invalid or missing total amount." });
        }

        if (stockQty === undefined || stockQty <= 0) {
            return res.status(400).json({ error: "Invalid or missing stock quantity." });
        }

        // Create stock payment
        const newStockPayment = await StockPayment.create({
            cashAmount,
            chequeAmount,
            due,
            vat,
            total,
            stockQty,
            supplierId,
        });

        res.status(201).json({
            message: "Stock payment created successfully",
            payment: newStockPayment,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({
                error: "Validation error: Please check the provided data.",
            });
        }
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}


async function getAllStockPayments(req, res) {
    try {
        const stockPayments = await StockPayment.findAll({
            include: [{ model: Supplier, as: 'supplier' }]
        });

        if (stockPayments.length === 0) {
            return res.status(404).json({ message: "No stock payments found" });
        }

        res.status(200).json(stockPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
}

async function getStockPaymentById(req, res) {
    try {
        const { id } = req.params;

        const stockPayment = await StockPayment.findByPk(id);

        if (!stockPayment) {
            return res.status(404).json({ message: `StockPayment not found for ID: ${id}` });
        }

        res.status(200).json(stockPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
}

async function updateStockPayment(req, res) {
    try {
        const { id } = req.params;
        const { cashAmount, chequeAmount, due, vat, total, stockQty, supplierId } = req.body;

        // Find the stock payment record by ID
        const stockPayment = await StockPayment.findByPk(id);

        if (!stockPayment) {
            return res.status(404).json({ message: `StockPayment not found for ID: ${id}` });
        }

        // Update the stock payment record
        await stockPayment.update({
            cashAmount,
            chequeAmount,
            due,
            vat,
            total,
            stockQty,
            supplierId,
        });

        // Respond with the updated record
        res.status(200).json({ message: "StockPayment updated successfully", stockPayment });
    } catch (error) {
        // Handle validation errors
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({
                error: "Validation error: Please check the provided data.",
                details: error.errors,
            });
        }

        // Handle other internal errors
        console.error("An internal error occurred:", error.message);
        return res.status(500).json({
            error: `An internal error occurred: ${error.message}`,
        });
    }
}


module.exports = {
    createStockPayment,
    getAllStockPayments,
    getStockPaymentById,
    updateStockPayment,
};
