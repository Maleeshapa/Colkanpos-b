const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const InvoiceProduct = require('./InvoiceProduct');
const Stock = require('./Stock');

const ReturnProduct = sequelize.define(
    'ReturnProduct',
    {
        returnProductId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        returnQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        returnItemType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        returnNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoiceProductId: {
            type: DataTypes.INTEGER,
            references: {
                model: InvoiceProduct,
                key: "invoiceProductId",
            },
            allowNull: false,
        },
        stockId: {
            type: DataTypes.INTEGER,
            references: {
                model: Stock,
                key: "stockId",
            },
            allowNull: false,
        },
    },
    {
        tableName: 'returnProducts',
        timestamps: false,
    }
);

ReturnProduct.belongsTo(InvoiceProduct, { foreignKey: 'invoiceProductId', as: 'invoiceProduct' });
ReturnProduct.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });

module.exports = ReturnProduct;