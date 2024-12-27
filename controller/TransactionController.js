const Transaction = require("../model/Transaction");
const Invoice = require("../model/Invoice");
const User = require("../model/User")

const createTransaction = async (req, res) => {
    try {
        const {
            transactionType,
            price,
            dateTime,
            discount,
            note,
            paid,
            due,
            invoiceId,
            userId,
        } = req.body;

        // if (!transactionType || !price || !dateTime) {
        //     return res.status(400).json({ error: "All fields are required." });
        // }

        // Validate invoice
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(400).json({ message: 'Invalid invoice ID' });
        }

        // Validate user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Create the transaction
        const newTransaction = await Transaction.create({
            transactionType,
            price,
            dateTime,
            discount,
            note,
            paid,
            due,
            invoice_invoiceId: invoiceId,
            user_userId: userId,
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Transaction creation error:', error);
        res.status(500).json({ message: 'An error occurred while creating the transaction.' });
    }
};



// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transaction = await Transaction.findAll();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id)
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteByInvoiceId = async (req, res) => {
    try {
        const { invoice_invoiceId } = req.params;

        // Find all transactions associated with the given invoice_invoiceId
        const transactions = await Transaction.findAll({ where: { invoice_invoiceId } });

        if (transactions.length === 0) {
            return res.status(404).json({ message: `No transactions found for invoice ID: ${invoice_invoiceId}` });
        }

        // Delete all transactions associated with the invoice_invoiceId
        await Transaction.destroy({ where: { invoice_invoiceId } });

        res.status(200).json({ message: `Transactions for invoice ID ${invoice_invoiceId} deleted successfully` });
    } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).json({ message: 'An error occurred while deleting the transactions.', error: error.message });
    }
};

const getTransactionsByInvoiceId = async (req, res) => {
    try {
        const { invoiceId } = req.params; // Extract invoiceId from route parameters

        // Find all transactions associated with the given invoiceId
        const transactions = await Transaction.findAll({
            where: { invoice_invoiceId: invoiceId },
        });

        if (transactions.length === 0) {
            return res.status(404).json({ message: `No transactions found for invoice ID: ${invoiceId}` });
        }

        // Return the found transactions
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'An error occurred while fetching the transactions.', error: error.message });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    deleteByInvoiceId,
    getTransactionsByInvoiceId
};