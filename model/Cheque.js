const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const Supplier = require('./Supplier');
const StockPayment = require('./StockPayment');

const Cheque = sequelize.define('Cheque', {
    chequeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chequeNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chequeAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    chequeDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    chequeStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending"
    },
    supplierId: {
        type: DataTypes.INTEGER,
        references: {
            model: "supplier",
            key: "supplierId",
        },
    },
    stockPaymentId: {
        type: DataTypes.INTEGER,
        references: {
            model: "stockPayment",
            key: "stockPaymentId",
        },
    },
},
    {
        tableName: 'chequedata',
        timestamps: false,
    }
);
Cheque.belongsTo(Supplier, { foreignKey: 'supplierId' });
Cheque.belongsTo(StockPayment, { foreignKey: 'stockPaymentId' });

module.exports = Cheque;