const { CostingHeader, CostingDetail } = require("../model/Costing");
const { Op } = require('sequelize');
const sequelize = require("../dbConfig");

async function createCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { headerData, detailsData } = req.body;

        // Create header with snake_case fields
        const costingHeader = await CostingHeader.create({
            total_amount: headerData.totalAmount,
            total_profit: headerData.totalProfit,
            status: headerData.status || 'draft'
        }, { transaction: t });

        // Create details with snake_case fields
        const costingDetails = await Promise.all(
            detailsData.map(detail => 
                CostingDetail.create({
                    costing_header_id: costingHeader.id,
                    description_customer: detail.descriptionCustomer,
                    product_code: detail.productCode,
                    description: detail.description,
                    warranty: detail.warranty,
                    supplier: detail.supplier,
                    unit_cost: detail.unitCost,
                    our_margin_percentage: detail.ourMarginPercentage,
                    our_margin_value: detail.ourMarginValue,
                    other_margin_percentage: detail.otherMarginPercentage,
                    other_margin_value: detail.otherMarginValue,
                    price_plus_margin: detail.pricePlusMargin,
                    selling_rate: detail.sellingRate,
                    selling_rate_rounded: detail.sellingRateRounded,
                    uom: detail.uom,
                    qty: detail.qty,
                    unit_price: detail.unitPrice,
                    discount_percentage: detail.discountPercentage,
                    discount_value: detail.discountValue,
                    discounted_price: detail.discountedPrice,
                    amount: detail.amount,
                    profit: detail.profit
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(201).json({
            message: "Costing created successfully",
            header: costingHeader,
            details: costingDetails
        });
    } catch (error) {
        await t.rollback();
        console.error('Error creating costing:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getAllCostings(req, res) {
    try {
        const costings = await CostingHeader.findAll({
            include: [CostingDetail],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(costings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCostingById(req, res) {
    try {
        const { id } = req.params;
        const costing = await CostingHeader.findByPk(id, {
            include: [CostingDetail]
        });

        if (costing) {
            res.status(200).json(costing);
        } else {
            res.status(404).json({ message: 'Costing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { headerData, detailsData } = req.body;

        const costingHeader = await CostingHeader.findByPk(id);
        if (!costingHeader) {
            await t.rollback();
            return res.status(404).json({ message: "Costing not found" });
        }

        // Update header
        await costingHeader.update(headerData, { transaction: t });

        // Delete existing details
        await CostingDetail.destroy({
            where: { costingHeaderId: id },
            transaction: t
        });

        // Create new details
        const newDetails = await Promise.all(
            detailsData.map(detail =>
                CostingDetail.create({
                    ...detail,
                    costingHeaderId: id
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(200).json({
            message: "Costing updated successfully",
            header: costingHeader,
            details: newDetails
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createCosting,
    getAllCostings,
    getCostingById,
    updateCosting
};