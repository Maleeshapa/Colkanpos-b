const Supplier = require("../model/Supplier");
const { Op } = require('sequelize');

const createSupplier = async (req, res) => {
    try {
        const {
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
        } = req.body;

        if (
            !supplierName ||
            !supplierAddress ||
            !supplierNic ||
            !supplierEmail ||
            !supplierTP
        ) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingSupplier = await Supplier.findOne({ where: { supplierNic } });
        if (existingSupplier) {
            return res
                .status(400)
                .json({ error: "A Supplier with this NIC already exists." });
        }

        const newSupplier = await Supplier.create({
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus: "Active",
        });

        res.status(201).json(newSupplier);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ error: "Validation error: Please check the provided data." });
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                error:
                    "Duplicate field value: A Supplier with this email,Nic or name already exists.",
            });
        }

        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get all Suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const supplier = await Supplier.findAll();
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSupplierByName = async (req, res) => {
    try {
        const { name } = req.params;

        const supplier = await Supplier.findOne({
            where: { supplierName: name }
        });

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        } supplier
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus
        } = req.body;

        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        await supplier.update({
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus
        });

        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        await supplier.destroy();
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSupplierSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        // Validate the query
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ error: 'Query must be at least 2 characters long.' });
        }

        // Fetch suggestions from the database
        const suppliers = await Supplier.findAll({
            where: {
                supplierName: {
                    [Op.like]: `%${query.trim()}%`, // Trim to avoid unnecessary spaces
                },
            },
            attributes: ['supplierName'], // Only return supplierName
            limit: 10, // Restrict the number of results
        });

        // If no suppliers found, return a helpful message
        if (suppliers.length === 0) {
            return res.status(404).json({ message: 'No suppliers found matching the query.' });
        }

        // Respond with the found suppliers
        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error fetching supplier suggestions:', error);
        res.status(500).json({ error: 'An error occurred while fetching supplier suggestions.' });
    }
};


module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    getSupplierByName,
    updateSupplier,
    deleteSupplier,
    getSupplierSuggestions
}
