const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Category = require("./Category");
const Product = require("./Products");

const RentalInvoice = sequelize.define(
    "RentalInvoice",
    {
        rentalInvoiceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rentalInvoiceDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rentalInvoiceTotalAmount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rentalInvoiceAdvancePayment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rentalInvoiceNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        products_productId: {
            type: DataTypes.INTEGER,
            references: {
                model: "product",
                key: "productId",
            },
            allowNull: false,
        },
    },
    {
        tableName: "rentalInvoice",
        timestamps: false,
    }
);

RentalInvoice.belongsTo(Product, {
    foreignKey: "products_productId",
    as: "product",
});
module.exports = RentalInvoice;