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
const InvoiceController = require("./controller/InvoiceController");
const TransactionController = require("./controller/TransactionController");
const StoreController = require("./controller/StoreController");
const ReturnController = require("./controller/ReturnController");
const ExpenseController = require("./controller/ExpensesController");
const ExpensesCatController = require("./controller/ExpensesCatController");
const ReportController = require("./controller/Reports/ReportController");
const ProductNStockController = require("./controller/Reports/ProductStockController");
const StockHistoryController = require('./controller/StockHistoryController');
const InvoiceProductController = require('./controller/InvoiceProduct');
const CustomerController = require('./controller/CustomerController');

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
app.put("/supplier/:id", SupplierController.updateSupplier);
app.delete("/supplier/:id", SupplierController.deleteSupplier);

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
app.put("/stock/:id", StockController.updateStock);
app.delete("/stock/:id", StockController.deleteStock);
app.get('/stock/product/:products_productId', StockController.getStockIdUsingProductId);

//Stock History routes
app.get('/stockHistory', StockHistoryController.getAllStockHistory);

//invoice routes
app.post("/invoice", InvoiceController.createInvoice);
app.get("/invoices", InvoiceController.getAllInvoice);
app.get("/invoice/:id", InvoiceController.getInvoiceById);
app.put("/invoice/:id", InvoiceController.updateInvoice);
app.delete("/invoice/:id", InvoiceController.deleteInvoice);
app.get('/invoice/invoiceNo/:num', InvoiceController.getInvoiceByNo);
app.get('/invoice/last', InvoiceController.getLastInvoiceNumber);

//invoiceProduct Route
app.post('/invoiceProduct', InvoiceProductController.createInvoiceProduct);
app.get('/invoiceProducts', InvoiceProductController.getAllInvoiceProducts);
app.get('/invoiceProducts/:invoiceId', InvoiceProductController.getInvoiceById)
app.delete('/invoiceProduct/:invoiceId', InvoiceProductController.deleteInvoiceProduct)
app.get('/invoiceProduct/:num', InvoiceProductController.getInvoiceProductsByNo);

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

// Sync the database
sequelize
    .sync()
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});