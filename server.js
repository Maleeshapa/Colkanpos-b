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
const SwitchController = require('./controller/SwitchController');
const InvoiceProductController = require('./controller/InvoiceProduct')

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'purchase-orders')));

const baseUploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
}

const uploadDir = path.join(baseUploadDir, 'purchase-orders');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage and file naming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and PDF files are allowed.'), false);
    }
};

// Configure multer upload
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    }
});

// Purchase order upload route
app.post('/api/purchase-orders/upload', upload.array('files', 5), (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files uploaded' 
            });
        }

        // Process uploaded files
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size
        }));

        // Here you might want to add additional logic like:
        // - Saving file metadata to a database
        // - Associating files with a specific purchase order
        // - Any additional processing

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing upload',
            error: error.message 
        });
    }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
            success: false,
            message: err.message || 'An unexpected error occurred'
        });
    }
    next();
});

// status endpoint
app.get('/api/switch', SwitchController.getStatus);
app.post('/api/switch', SwitchController.updateStatus);

//user routes
app.post("/user", UserController.createUser);
app.get("/users", UserController.getAllUsers);
app.get("/user/:id", UserController.getUserById);
app.put("/user/:id", UserController.updateUser);
app.delete("/user/:id", UserController.deleteUser);
app.post("/userLogin", UserController.userLogin);
app.get("/users/hidden/:is_hidden", UserController.getUsersByHiddenStatus);

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