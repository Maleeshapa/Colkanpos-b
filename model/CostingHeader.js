const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

module.exports = (sequelize) => {
    const CostingHeader = sequelize.define('CostingHeader', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalAmount: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'total_amount'
        },
        totalProfit: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'total_profit'
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'draft'
        }
    }, {
        tableName: 'costing_headers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return CostingHeader;
};
