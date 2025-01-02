const Invoice = require("../model/Invoice");
const Return = require("../model/Return");
const Store = require("../model/Store");
const User = require("../model/User");

const createReturn = async (req, res) => {
    try {
        const {
            returnItemDate,
            storeId,
            userId,
            invoiceId,
        } = req.body;

        // Ensure all required fields are present
        if (!returnItemDate || !storeId || !userId || !invoiceId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate foreign keys
        const store = await Store.findByPk(storeId);
        if (!store) return res.status(400).json({ message: "Invalid store ID" });

        const user = await User.findByPk(userId);
        if (!user) return res.status(400).json({ message: "Invalid user ID" });

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return res.status(400).json({ message: "Invalid invoice ID" });

        // Create the return
        const newReturn = await Return.create({
            returnItemDate,
            store_storeId: storeId,
            user_userId: userId,
            invoice_invoiceId: invoiceId,
        });

        // Fetch the newly created return with associations
        const returnWithAssociations = await Return.findByPk(newReturn.returnItemId, {
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });

        // Send the created return data as a response
        res.status(201).json(returnWithAssociations);
    } catch (error) {
        return res.status(500).json({ message: `An internal error occurred: ${error.message}` });
    }
};

// Get all returns
const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.findAll({
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get a return by ID
const getReturnById = async (req, res) => {
    try {
        const { id } = req.params;
        const returnItem = await Return.findByPk(id, {
            include: [
                { model: Store, as: "store" },
                { model: User, as: "user" },
                { model: Invoice, as: "invoice" },
            ],
        });

        if (returnItem) {
            res.status(200).json(returnItem);
        } else {
            res.status(404).json({ message: "Return not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};

module.exports = {
    createReturn,
    getAllReturns,
    getReturnById,
};
