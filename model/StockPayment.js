const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Supplier = require("./Supplier");

const StockPayment = sequelize.define(
    "StockPayment",
    {
        stockPaymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cashAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        chequeAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        due: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stockQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        supplierId: {
            type: DataTypes.INTEGER,
            references: {
                model: Supplier,
                key: "supplierId",
            },
        },
    },
    {
        tableName: "stockPayments",
        timestamps: false,
    }
);

StockPayment.belongsTo(Supplier, {
    foreignKey: "supplierId",
    as: "supplier",
});

module.exports = StockPayment;