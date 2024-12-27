const ReturnProduct = require('../model/ReturnProduct');
const InvoiceProduct = require('../model/InvoiceProduct');
const Stock = require('../model/Stock');

async function createReturnProduct(req, res) {
    try {
        const returns = req.body;

        // Validate input
        if (!Array.isArray(returns) || returns.length === 0) {
            return res.status(400).json({ message: 'No returns provided' });
        }

        const createdReturns = [];

        for (const returnItem of returns) {
            const { returnQty, returnItemType, returnNote, invoiceProductId, stockId } = returnItem;

            // Validate related entities
            const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
            if (!invoiceProduct) {
                return res.status(400).json({ message: `Invalid invoice product ID: ${invoiceProductId}` });
            }

            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(400).json({ message: `Invalid stock ID: ${stockId}` });
            }

            // Create return product
            const newReturnProduct = await ReturnProduct.create({
                returnQty,
                returnItemType,
                returnNote,
                invoiceProductId,
                stockId,
            });

            createdReturns.push(newReturnProduct);

            if (returnItemType === "Refund") {
                const updatedStockQty = parseFloat(stock.stockQty) + parseFloat(returnQty);
                await stock.update({ stockQty: updatedStockQty });
            }
        }

        res.status(201).json({
            message: 'New returns added successfully',
            returns: createdReturns,
        });
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getAllReturnProducts(req, res) {
    try {
        const returnProducts = await ReturnProduct.findAll({
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct'
                },
                {
                    model: Stock,
                    as: 'stock'
                },
            ]
        });

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getAllReturnProductsById(req, res) {
    try {
        const returnProductId = req.params.id;

        const returnProducts = await ReturnProduct.findAll({
            where: { returnProductId },
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct',
                },
                {
                    model: Stock,
                    as: 'stock',
                },
            ],
        });

        if (returnProducts.length === 0) {
            return res.status(404).json({ message: 'No return products found for the given ID' });
        }

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

module.exports = {
    createReturnProduct,
    getAllReturnProducts,
    getAllReturnProductsById
};
