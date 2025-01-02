const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./dbConfig");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

//Controllers
const SupplierController = require("./controller/SupplerController");
const UserController = require("./controller/UserController");
const CategoryController = require("./controller/CategoryController");
const ProductController = require("./controller/ProductController");
const StockController = require("./controller/StockController");
const StockPaymentController = require("./controller/StockPaymenTController");
const StockHistoryController = require('./controller/StockHistoryController');
const InvoiceController = require("./controller/InvoiceController");
const TransactionController = require("./controller/TransactionController");
const StoreController = require("./controller/StoreController");
const ReturnController = require("./controller/ReturnController");
const ReturnProductController = require("./controller/ReturnProductController");
const ExpenseController = require("./controller/ExpensesController");
const ExpensesCatController = require("./controller/ExpensesCatController");
const ReportController = require("./controller/Reports/ReportController");
const ProductNStockController = require("./controller/Reports/ProductStockController");
const InvoiceProductController = require('./controller/InvoiceProduct');
const CustomerController = require('./controller/CustomerController');
const DeliveryNoteController = require('./controller/DeliveryNoteController');
const CostingController = require('./controller/CostingController');
const ChequeController = require('./controller/ChequeController');
// const CostingController = require("./controller/CostingController");
// const CostingController = require("./controller/");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'purchase-orders')));


//user routes
app.post("/user", UserController.createUser);
app.get("/users", UserController.getAllUsers);
app.get("/user/:id", UserController.getUserById);
app.get('/user/name/:name', UserController.getUserByName);
app.put("/user/:id", UserController.updateUser);
app.delete("/user/:id", UserController.deleteUser);
app.post("/userLogin", UserController.userLogin);

//supplier routes
app.post("/supplier", SupplierController.createSupplier);
app.get("/suppliers", SupplierController.getAllSuppliers);
app.get("/supplier/:id", SupplierController.getSupplierById);
app.get("/supplier/supplierName/:name", SupplierController.getSupplierByName);
app.put("/supplier/:id", SupplierController.updateSupplier);
app.delete("/supplier/:id", SupplierController.deleteSupplier);
app.get('/suppliers/suggestions', SupplierController.getSupplierSuggestions);

//category routes
app.post("/category", CategoryController.createCategory);
app.get("/categories", CategoryController.getAllCategories);
app.get("/category/:id", CategoryController.getCategoryById);
app.put("/category/:id", CategoryController.updateCategory);
app.delete("/category/:id", CategoryController.deleteCustomer);

//customer routes
app.post('/customer', CustomerController.createCustomer);
app.get('/customers', CustomerController.getAllCustomers);
app.get('/customer/:id', CustomerController.getCustomerById);
app.put('/customer/:id', CustomerController.updateCustomer);
app.delete('/customer/:id', CustomerController.deleteCustomer);
app.get("/customer/cusCode/:code", CustomerController.getCustomerByCode);
app.get("/customer/cusName/:name", CustomerController.getCustomerByName);
app.get('/customers/suggestions', CustomerController.getCustomerSuggestions);

//product routes
app.post("/product", ProductController.createProduct);
app.get("/products", ProductController.getAllProducts);
app.get("/product/:id", ProductController.getProductById);
app.put("/product/:id", ProductController.updateProduct);
app.delete("/product/:id", ProductController.deleteProduct);
app.get("/product/productName/:name", ProductController.getProductByName);
app.get('/product/codeOrName/:value', ProductController.getProductByCodeOrName);
app.get('/products/suggestions', ProductController.getProductSuggestions);

//stock routes
app.post("/stock", StockController.createStock);
app.get("/stocks", StockController.getAllStocks);
app.get("/stock/:id", StockController.getStockById);
app.get('/stock/product/:products_productId', StockController.getStockIdUsingProductId);
app.put("/stock/:id", StockController.updateStock);
app.delete("/stock/:id", StockController.deleteStock);

//stockPayment routes
app.post("/stockPayment", StockPaymentController.createStockPayment);
app.get("/stockPayments", StockPaymentController.getAllStockPayments);
app.get("/stockPayment/:id", StockPaymentController.getStockPaymentById);
app.put("/stockPayment/:id", StockPaymentController.updateStockPayment);

//cheque routes
app.post("/cheque", ChequeController.addCheque);

//Stock History routes
app.get('/stockHistory', StockHistoryController.getAllStockHistory);

//invoice routes
app.post("/invoice", InvoiceController.createInvoice);
app.get("/invoices", InvoiceController.getAllInvoice);
app.get("/invoice/:id", InvoiceController.getInvoiceById);
app.put("/invoice/:id", InvoiceController.updateInvoice);
app.put("/invoiceTime/:id", InvoiceController.updateInvoicetime);
app.delete("/invoice/:id", InvoiceController.deleteInvoice);
app.get('/invoice/invoiceNo/:num', InvoiceController.getInvoiceByNo);
app.get('/invoice/last', InvoiceController.getLastInvoiceNumber);
app.post('/invoice/:id', InvoiceController.addImage);

//invoiceProduct Route
app.post('/invoiceProduct', InvoiceProductController.createInvoiceProduct);
app.get('/invoiceProducts', InvoiceProductController.getAllInvoiceProducts);
app.get('/invoiceProducts/:invoiceId', InvoiceProductController.getInvoiceById)
app.delete('/invoiceProduct/:invoiceId', InvoiceProductController.deleteInvoiceProduct)
app.get('/invoiceProduct/:num', InvoiceProductController.getInvoiceProductsByNo);
app.put('/invoiceProducts/:id', InvoiceProductController.updateInvoiceProductStatus);
app.put('/invoiceProductsQty/:id', InvoiceProductController.updateInvoiceProductQty);

//Delivery note Route
app.post('/deliveryNote', DeliveryNoteController.createDeliveryNote);
app.get('/deliveryNotes', DeliveryNoteController.getAllDeliveryNote);
app.get('/deliveryNotes/:invoiceId', DeliveryNoteController.getDeliveryNoteById)
app.delete('/deliveryNote/:invoiceId', DeliveryNoteController.deleteDeliveryNote)
app.get('/deliveryNote/:num', DeliveryNoteController.getDeliveryNoteByNo);
app.put('/deliveryNotes/:id', DeliveryNoteController.updateDeliveryNoteStatus);
app.put('/deliveryNotesStatus/:id', DeliveryNoteController.updateStatus);

//transaction routes
app.post("/transaction", TransactionController.createTransaction);
app.get("/transactions", TransactionController.getAllTransactions);
app.get("/transactions/:id", TransactionController.getTransactionById);
app.get('/transaction/invoice/:invoiceId', TransactionController.getTransactionsByInvoiceId);
app.delete('/transactions/invoice/:invoice_invoiceId', TransactionController.deleteByInvoiceId);

//store routes
app.post("/store", StoreController.createStore);
app.get("/stores", StoreController.getAllStores);
app.get("/store/:id", StoreController.getStoreById);
app.put("/store/:id", StoreController.updateStore);
app.delete("/store/:id", StoreController.deleteStore);

//return routes
app.post("/return", ReturnController.createReturn);
app.get("/returns", ReturnController.getAllReturns);
app.get("/return/:id", ReturnController.getReturnById);

//returnProduct routes
app.post("/returnProduct", ReturnProductController.createReturnProduct);
app.get("/returnProducts", ReturnProductController.getAllReturnProducts);
app.get("/returnProduct/:id", ReturnProductController.getAllReturnProductsById);

//expenses routes
app.post("/expense", ExpenseController.createExpense);
app.get("/expenses", ExpenseController.getAllExpenses);
app.get("/expense/:id", ExpenseController.getExpenseById);
app.put("/expense/:id", ExpenseController.updateExpense);
app.delete("/expense/:id", ExpenseController.deleteExpense);

//expenses category routes
app.post("/expensesCat", ExpensesCatController.createExpensesCategory);
app.get("/expensesCats", ExpensesCatController.getAllExpensesCats);
app.get("/expensesCat/:id", ExpensesCatController.getExpensesCatById);
app.put("/expensesCat/:id", ExpensesCatController.updateExpensesCat);
app.delete("/expensesCat/:id", ExpensesCatController.deleteExpensesCat);

//get reports
app.get("/getReports", ReportController.getReports);
app.get("/productStock", ProductNStockController.getStockReports);

// //Costing routes
app.post("/costing", CostingController.createCosting);
app.get("/costings", CostingController.getAllCostings);
app.get("/costing/:id", CostingController.getCostingById);
app.put("/costing/:id", CostingController.updateCosting);

// Sync the database
sequelize
    .sync()
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });


app.get('/download/invoice/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'invoice', filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                res.status(500).json({ error: "Error downloading the file" });
            }
        });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});