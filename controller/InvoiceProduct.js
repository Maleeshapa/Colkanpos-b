const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const InvoiceProduct = require('../model/InvoiceProduct')

const createInvoiceProduct = async (req, res) => {
  try {
    const invoiceProducts = req.body;

    // Validate input
    if (!Array.isArray(invoiceProducts) || invoiceProducts.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const insufficientStockProducts = [];

    for (const invoiceProduct of invoiceProducts) {
      const { productId, stockId, invoiceId,invoiceNo, totalAmount, invoiceQty,invoiceProductStatus } = invoiceProduct;

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

      // Check if enough stock is available
      if (stock.stockQty < invoiceQty) {
        insufficientStockProducts.push({
          productId,
          productName: product.productName,
          availableStock: stock.stockQty,
          requestedQuantity: invoiceQty
        });
      }
    }

    // If any products have insufficient stock, return detailed error
    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        message: 'Insufficient stock for some products',
        insufficientProducts: insufficientStockProducts
      });
    }

    // Process invoice products if all stock is sufficient
    const createdInvoiceProducts = [];
    for (const invoiceProduct of invoiceProducts) {
      const { productId, stockId, invoiceId,invoiceNo, totalAmount, invoiceQty,invoiceProductStatus } = invoiceProduct;

      // Find stock and update quantity
      const stock = await Stock.findByPk(stockId);
      const updatedStockQty = stock.stockQty - invoiceQty;
      await stock.update({ stockQty: updatedStockQty });

      // Create the invoice product
      const newInvoiceProduct = await InvoiceProduct.create({
        productId,
        stockId,
        invoiceId,
        invoiceNo,
        totalAmount,
        invoiceQty,
        invoiceProductStatus,
      });

      createdInvoiceProducts.push(newInvoiceProduct);
    }

    res.status(201).json({
      message: 'Invoice products created successfully',
      invoiceProducts: createdInvoiceProducts
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
const getAllInvoiceProducts = async (req, res) => {
  try {
    const invoiceProduct = await InvoiceProduct.findAll({
      include: [
        { model: Invoice, as: 'invoice' },
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' },
      ]
    });
    res.status(200).json(invoiceProduct);
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Fetch invoice products along with associated product and stock details
    const invoiceProducts = await InvoiceProduct.findAll({
      where: { invoiceId },
      include: [
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' }
      ]
    });

    if (invoiceProducts.length === 0) {
      return res.status(404).json({ message: 'No invoice products found' });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}

const getInvoiceProductsByNo = async (req, res) => {
  try {
    const { num } = req.params;

    // Find invoice products by the invoice number
    const invoiceProducts = await InvoiceProduct.findAll({
      where: { invoiceNo: num },
      include: [
        { model: Product, as: 'product' },
        { model: Stock, as: 'stock' }
      ]
    });

    if (!invoiceProducts || invoiceProducts.length === 0) {
      return res.status(404).json({ message: "Invoice products not found for the given number" });
    }

    res.status(200).json(invoiceProducts);
  } catch (error) {
    console.error('Error fetching invoice products by number:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};


const deleteInvoiceProduct = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoiceProducts = await InvoiceProduct.findAll({ where: { invoiceId } });

    if (invoiceProducts.length === 0) {
      return res.status(404).json({ message: `No products found for invoice ID: ${invoiceId}` });
    }

    for (const invoiceProduct of invoiceProducts) {
      const { stockId, invoiceQty } = invoiceProduct;

      const stock = await Stock.findByPk(stockId);
      if (!stock) {
        return res.status(404).json({ message: `Stock with ID ${stockId} not found` });
      }

      const updatedStockQty = stock.stockQty + invoiceQty;
      await stock.update({ stockQty: updatedStockQty });

      await invoiceProduct.destroy();
    }

    res.status(200).json({ message: `All products for invoice ID ${invoiceId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting invoice products:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

module.exports = {
  createInvoiceProduct,
  getAllInvoiceProducts,
  deleteInvoiceProduct,
  getInvoiceById,
  getInvoiceProductsByNo 
};
