const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Customer = require("./Customer");

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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        store: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusId: {
            type: DataTypes.INTEGER,
            references: {
                model: Customer,
                key: "cusId",
            },
            allowNull: false,
        },
    },
    {
        tableName: "invoice",
        timestamps: false,
    }
);

Invoice.belongsTo(Customer, {
    foreignKey: "cusId",
    as: "customer",
});
module.exports = Invoice;
