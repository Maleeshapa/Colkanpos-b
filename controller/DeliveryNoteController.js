const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const DeliveryNote = require('../model/DeliveryNote')

const createDeliveryNote = async (req, res) => {
    try {
        const deliveryNotes = req.body;

        // Validate input
        if (!Array.isArray(deliveryNotes) || deliveryNotes.length === 0) {
            return res.status(400).json({ message: 'No products provided' });
        }

        for (const deliveryNote of deliveryNotes) {
            const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty,sendQty, deliveryStatus } = deliveryNote;

            // Check if the product exists
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid product ID: ${productId}` });
            }

            // Check if the stock exists
            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(400).json({ message: `Invalid stock ID: ${stockId}` });
            }

            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) {
                return res.status(400).json({ message: 'Invalid invoice ID' });
            }
        }

        // Process invoice products if all stock is sufficient
        const createdDeliveryStatus = [];
        for (const deliveryNote of deliveryNotes) {
            const { productId, stockId, invoiceId, invoiceNo, totalAmount, invoiceQty,sendQty, deliveryStatus } = deliveryNote;

            // Create the invoice product
            const newDeliveryNote = await DeliveryNote.create({
                productId,
                stockId,
                invoiceId,
                invoiceNo,
                totalAmount,
                invoiceQty,
                sendQty,
                deliveryStatus,
            });

            createdDeliveryStatus.push(newDeliveryNote);
        }

        res.status(201).json({
            //   message: 'Invoice products created successfully',
            deliveryNotes: createdDeliveryStatus
        });

    } catch (error) {
        console.error('Error creating invoice products:', error);
        res.status(500).json({
            message: 'Server error occurred while creating the invoice products',
            error: error.message,
        });
    }
};

// Get all Invoice Products
const getAllDeliveryNote = async (req, res) => {
    try {
        const deliveryNote = await DeliveryNote.findAll({
            include: [
                { model: Invoice, as: 'invoice' },
                { model: Product, as: 'product' },
                { model: Stock, as: 'stock' },
            ]
        });
        res.status(200).json(deliveryNote);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getDeliveryNoteById = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const deliveryNote = await DeliveryNote.findAll({
            where: { invoiceId },
            include: [
                { model: Product, as: 'product' },
                { model: Stock, as: 'stock' }
            ]
        });

        if (deliveryNote.length === 0) {
            return res.status(404).json({ message: 'No invoice products found' });
        }

        res.status(200).json(deliveryNote);
    } catch (error) {
        console.error('Error fetching invoice products:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

const getDeliveryNoteByNo = async (req, res) => {
    try {
        const { num } = req.params;

        // Find invoice products by the invoice number
        const deliveryNote = await DeliveryNote.findAll({
            where: { invoiceNo: num },
            include: [
                { model: Product, as: 'product' },
                { model: Stock, as: 'stock' }
            ]
        });

        if (!deliveryNote || deliveryNote.length === 0) {
            return res.status(404).json({ message: "Invoice products not found for the given number" });
        }

        res.status(200).json(deliveryNote);
    } catch (error) {
        console.error('Error fetching invoice products by number:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};


const deleteDeliveryNote = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const deliveryNotes = await DeliveryNote.findAll({ where: { invoiceId } });

        if (deliveryNotes.length === 0) {
            return res.status(404).json({ message: `No products found for invoice ID: ${invoiceId}` });
        }

        for (const deliveryNote of deliveryNotes) {
            const { stockId, invoiceQty } = deliveryNote;

            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(404).json({ message: `Stock with ID ${stockId} not found` });
            }

            const updatedStockQty = stock.stockQty + invoiceQty;
            await stock.update({ stockQty: updatedStockQty });

            await deliveryNote.destroy();
        }

        res.status(200).json({ message: `All products for invoice ID ${invoiceId} deleted successfully` });
    } catch (error) {
        console.error('Error deleting invoice products:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const updateDeliveryNoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { sendQty } = req.body;

        // Find the delivery note by its primary key
        const deliveryNote = await DeliveryNote.findByPk(id);

        if (!deliveryNote) {
            return res.status(404).json({ message: 'Delivery note not found' });
        }

        // Validate the input quantity if provided
        if (typeof sendQty !== 'undefined' && sendQty < 0) {
            return res.status(400).json({ message: 'Invalid quantity provided' });
        }

        if (typeof sendQty !== 'undefined') {
            deliveryNote.sendQty = sendQty;
        }

        // Save the changes
        await deliveryNote.save();

        res.status(200).json({ 
            message: 'Delivery note updated successfully', 
            deliveryNote 
        });
    } catch (error) {
        console.error('Error updating delivery note status:', error);
        res.status(500).json({ 
            message: 'Error updating delivery note status', 
            error: error.message 
        });
    }
};


module.exports = {
    createDeliveryNote,
    getAllDeliveryNote,
    deleteDeliveryNote,
    getDeliveryNoteById,
    getDeliveryNoteByNo,
    updateDeliveryNoteStatus,
};
