const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Invoice = require('./Invoice')
const Product = require("./Products");
const Stock = require("./Stock");

const DeliveryNote = sequelize.define(
    "DeliveryNote",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
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
        invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
            },
            allowNull: false,
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        invoiceQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sendQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deliverdQty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deliveryStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "deliverynote",
        timestamps: false,
    }
);
DeliveryNote.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});
DeliveryNote.belongsTo(Stock, {
    foreignKey: "stockId",
    as: "stock",
});
DeliveryNote.belongsTo(Invoice, {
    foreignKey: "invoiceId",
    as: "invoice", 
});

module.exports = DeliveryNote;
