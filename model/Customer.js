const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Customer = sequelize.define(
    "Customer",
    {
        cusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cusCode: {
            type: DataTypes.STRING,
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
        cusPhone: {
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
        cusStore: {
            type: DataTypes.STRING,
            allowNull: false,
        },        
        cusEmail: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
    },
    {
        tableName: "customer",
        timestamps: false,
    }
);
module.exports = Customer;