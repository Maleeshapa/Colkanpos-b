const ReturnProduct = require('../model/ReturnProduct');
const InvoiceProduct = require('../model/InvoiceProduct');
const Stock = require('../model/Stock');
const Return = require('../model/Return');

async function createReturnProduct(req, res) {
    try {
        const returns = req.body;

        // Validate input
        if (!Array.isArray(returns) || returns.length === 0) {
            return res.status(400).json({ message: "No returns provided" });
        }

        const createdReturns = [];

        for (const returnItem of returns) {
            const { returnQty, returnAmount, returnItemType, returnNote, returnDate, invoiceProductId, stockId, returnItemId } = returnItem;

            // Validate required fields
            if (!returnQty || !returnItemType || !invoiceProductId || !stockId || !returnItemId) {
                return res.status(400).json({
                    message: "Missing required fields in return item",
                    returnItem,
                });
            }

            // Validate related entities
            const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
            if (!invoiceProduct) {
                return res.status(400).json({
                    message: `Invalid invoice product ID: ${invoiceProductId}`,
                });
            }

            const stock = await Stock.findByPk(stockId);
            if (!stock) {
                return res.status(400).json({
                    message: `Invalid stock ID: ${stockId}`,
                });
            }

            // Create return product
            const newReturnProduct = await ReturnProduct.create({
                returnQty,
                returnAmount,
                returnItemType,
                returnNote,
                returnDate,
                invoiceProductId,
                stockId,
                returnItemId,
            });

            createdReturns.push(newReturnProduct);

            if (returnItemType === "Refund") {
                const updatedStockQty = parseFloat(stock.stockQty) + parseFloat(returnQty);
                console.log("Current stockQty:", stock.stockQty);
                console.log("Return Qty:", returnQty);
                console.log("Updated stockQty:", updatedStockQty);

                if (isNaN(updatedStockQty)) {
                    throw new Error("Calculated stockQty is not a number");
                }
            }
        }

        res.status(201).json({
            message: "New returns added successfully",
            returns: createdReturns,
        });
    } catch (error) {
        console.error("Error creating return products:", error);
        res.status(500).json({
            error: `An error occurred: ${error.message}`,
        });
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
                {
                    model: Return,
                    as: 'return'
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
                {
                    model: Return,
                    as: 'return'
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
