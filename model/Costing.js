const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const CostingHeader = sequelize.define(
    "CostingHeader",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        total_amount: {  // Changed from totalAmount
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        total_profit: {  // Changed from totalProfit
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'draft'
        },
        created_at: {    // Changed from createdAt
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {    // Changed from updatedAt
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "costing_headers",
        timestamps: true,
        underscored: true,  // This tells Sequelize to use snake_case
    }
);

const CostingDetail = sequelize.define(
    "CostingDetail",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        costing_header_id: {  // Changed from costingHeaderId
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'costing_headers',
                key: 'id'
            }
        },
        description_customer: {  // Changed from descriptionCustomer
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        product_code: {  // Changed from productCode
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        warranty: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        supplier: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        unit_cost: {  // Changed from unitCost
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        our_margin_percentage: {  // Changed from ourMarginPercentage
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        our_margin_value: {  // Changed from ourMarginValue
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        other_margin_percentage: {  // Changed from otherMarginPercentage
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        other_margin_value: {  // Changed from otherMarginValue
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        price_plus_margin: {  // Changed from pricePlusMargin
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        selling_rate: {  // Changed from sellingRate
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        selling_rate_rounded: {  // Changed from sellingRateRounded
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        uom: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        qty: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        unit_price: {  // Changed from unitPrice
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        discount_percentage: {  // Changed from discountPercentage
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        discount_value: {  // Changed from discountValue
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        discounted_price: {  // Changed from discountedPrice
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        profit: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        created_at: {  // Changed from createdAt
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "costing_details",
        timestamps: false,
        underscored: true,  // This tells Sequelize to use snake_case
    }
);

// Set up associations
CostingHeader.hasMany(CostingDetail, { foreignKey: 'costing_header_id' });
CostingDetail.belongsTo(CostingHeader, { foreignKey: 'costing_header_id' });

module.exports = {
    CostingHeader,
    CostingDetail
};