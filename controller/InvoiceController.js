const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const Customer = require("../model/Customer");
const Transaction = require("../model/Transaction")

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'invoice');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const invoiceNo = req.body.invoiceNo || 'INV';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeInvoiceNo = invoiceNo.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeInvoiceNo}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('image');

const generateNextInvoiceNumber = async () => {
    try {
        const lastInvoice = await Invoice.findOne({
            order: [['invoiceNo', 'DESC']],
        });

        if (!lastInvoice) {
            return 1500;
        }

        // Generate the next sequential number
        const nextInvoiceNo = parseInt(lastInvoice.invoiceNo) + 1;
        return nextInvoiceNo;
    } catch (error) {
        throw new Error(`Error generating invoice number: ${error.message}`);
    }
};

// Create invoice
const createInvoice = async (req, res) => {

    try {
        const {
            invoiceDate,
            status = 'invoice',
            purchaseNo,
            store,
            cusId,
        } = req.body;

        const existingInvoice = await Invoice.findOne({ where: { purchaseNo } });
        if (existingInvoice) {
            return res.status(400).json({ error: "Purchase number already exist" });
        }

        const invoiceNo = req.body.invoiceNo || await generateNextInvoiceNumber();

        const newInvoice = await Invoice.create({
            invoiceNo,
            invoiceDate,
            status,
            purchaseNo,
            store,
            cusId
        });

        res.status(201).json(newInvoice);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        return res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
};


const getLastInvoiceNumber = async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne({
            order: [['invoiceNo', 'DESC']],
        });

        if (!lastInvoice) {
            return res.status(200).json({ lastInvoiceNo: 1500 });
        }

        res.status(200).json({ lastInvoiceNo: lastInvoice.invoiceNo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                { model: Customer, as: 'customer' },
            ],
        });

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found" });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get invoice by id with customer and product details

const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id, {
            include: [
                { model: Customer, as: 'customer' },
            ],
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInvoiceByNo = async (req, res) => {
    try {
        const { num } = req.params;

        const invoice = await Invoice.findOne({
            where: { invoiceNo: num },
            include: [{ model: Customer, as: 'customer' }],
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update invoice
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            // invoiceNo,
            invoiceDate,
            totalAmount,
            invoiceQty,
            productId,
            cusId,
        } = req.body;

        // Check if customer exists
        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        if (productId) {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
        }

        const invoice = await Invoice.findByPk(id);
        if (invoice) {
            await invoice.update({
                invoiceNo,
                invoiceDate,
                totalAmount,
                invoiceQty,
                products_productId: productId,
                customer_cusId: cusId,
            });
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};
// Delete a Invoice
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        await invoice.destroy();
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Multer error: Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const { id } = req.params;

            const invoice = await Invoice.findByPk(id);
            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const image = `${req.protocol}://${req.get('host')}/uploads/invoice/${req.file.filename}`;
            invoice.image = image;
            await invoice.save();

            return res.status(200).json({
                message: "File successfully uploaded",
                image,
            });

        } catch (error) {
            console.error("Error updating invoice image:", error);
            return res.status(500).json({ error: "Server error: Unable to update file" });
        }
    });
}

module.exports = {
    createInvoice,
    getAllInvoice,
    getInvoiceById,
    getInvoiceByNo,
    updateInvoice,
    deleteInvoice,
    getLastInvoiceNumber,
    generateNextInvoiceNumber,
    addImage,
};
