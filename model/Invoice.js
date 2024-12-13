const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Product = require("./Products");
const Stock = require("./Stock");

const Invoice = sequelize.define(
    "Invoice",
    {
        invoiceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        invoiceNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoiceDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        cusName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusJob: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusOffice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "invoice",
        timestamps: false,
    }
);
module.exports = Invoice;
