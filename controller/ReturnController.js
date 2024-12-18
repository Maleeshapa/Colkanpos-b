const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Return = require("../model/Return");
const Store = require("../model/Store");
const User = require("../model/User");
const Stock = require("../model/Stock");

const createReturn = async (req, res) => {
    try {
        const {
            returnItemType,
            returnItemDate,
            returnQty,
            returnNote,
            productId,
            storeId,
            userId,
            invoiceId,
            stockId,
        } = req.body;

        // Ensure all required fields are present
        if (!returnItemType || !returnItemDate || !productId || !storeId || !userId || !invoiceId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate entities
        const product = await Product.findByPk(productId);
        if (!product) return res.status(400).json({ message: 'Invalid product ID' });

        const store = await Store.findByPk(storeId);
        if (!store) return res.status(400).json({ message: 'Invalid store ID' });

        const user = await User.findByPk(userId);
        if (!user) return res.status(400).json({ message: 'Invalid user ID' });

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return res.status(400).json({ message: 'Invalid invoice ID' });

        const stock = await Stock.findByPk(stockId);
        if (!stock) return res.status(400).json({ message: 'Invalid stock ID' });

        // Calculate the return amount
        const returnAmount = parseFloat(returnQty) * parseFloat(product.productProfit);

        // Create the return
        const newReturn = await Return.create({
            returnItemType,
            returnItemDate,
            returnQty,
            returnNote,
            returnAmount,
            products_productId: productId,
            store_storeId: storeId,
            user_userId: userId,
            invoice_invoiceId: invoiceId,
            stockId: stockId,
        });

        // If return type is "Exchange," adjust the stock quantity
        if (returnItemType === "Exchange") {
            const updatedStockQty = parseFloat(stock.stockQty) + parseFloat(returnQty);
            await stock.update({ stockQty: updatedStockQty });
        }

        // Fetch the newly created return with associations
        const returnWithAssociations = await Return.findByPk(newReturn.returnItemId, {
            include: [
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
                { model: Stock, as: 'stock' },
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
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
                { model: Stock, as: 'stock' },
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
        const returns = await Return.findByPk(id, {
            include: [
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
                { model: Stock, as: 'stock' },
            ],
        });

        if (returns) {
            res.status(200).json(returns);
        } else {
            res.status(404).json({ message: 'Return not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReturn,
    getAllReturns,
    getReturnById,
};
