const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Product = require("./Products");
const Store = require("./Store");
const User = require("./User");
const Invoice = require("./Invoice");
const Stock = require("./Stock");

const Return = sequelize.define(
    "Return",
    {
        returnItemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        returnItemDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        returnAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        store_storeId: {
            type: DataTypes.INTEGER,
            references: {
                model: Store,
                key: "storeId",
            },
            allowNull: false,
        },
        user_userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "userId",
            },
            allowNull: false,
        },
        invoice_invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
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
        tableName: "returnItems",
        timestamps: false,
    }
);
Return.belongsTo(Store, {
    foreignKey: "store_storeId",
    as: "store",
});
Return.belongsTo(User, {
    foreignKey: "user_userId",
    as: "user",
});
Return.belongsTo(Invoice, {
    foreignKey: "invoice_invoiceId",
    as: "invoice",
});
Return.belongsTo(Stock, {
    foreignKey: "stockId",
    as: "stock",
});

module.exports = Return;
