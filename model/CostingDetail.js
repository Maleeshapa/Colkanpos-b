const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

module.exports = (sequelize) => {
    const CostingDetail = sequelize.define('CostingDetail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descriptionCustomer: {
            type: DataTypes.STRING(255),
            field: 'description_customer'
        },
        productCode: {
            type: DataTypes.STRING(100),
            field: 'product_code'
        },
        description: DataTypes.TEXT,
        warranty: DataTypes.STRING(100),
        supplier: DataTypes.STRING(255),
        unitCost: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'unit_cost'
        },
        ourMarginPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            field: 'our_margin_percentage'
        },
        ourMarginValue: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'our_margin_value'
        },
        otherMarginPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            field: 'other_margin_percentage'
        },
        otherMarginValue: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'other_margin_value'
        },
        pricePlusMargin: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'price_plus_margin'
        },
        sellingRate: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'selling_rate'
        },
        sellingRateRounded: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'selling_rate_rounded'
        },
        uom: DataTypes.STRING(50),
        qty: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        unitPrice: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'unit_price'
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            field: 'discount_percentage'
        },
        discountValue: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'discount_value'
        },
        discountedPrice: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'discounted_price'
        },
        amount: DataTypes.DECIMAL(15, 2),
        profit: DataTypes.DECIMAL(15, 2)
    }, {
        tableName: 'costing_details',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return CostingDetail;
};