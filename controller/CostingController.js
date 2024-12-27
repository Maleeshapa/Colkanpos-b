// controller/CostingController.js

const CostingDetail = require("../model/CostingDetail");
const CostingHeader = require("../model/CostingHeader");


const CostingController = {
    createCosting: async (req, res) => {
        const { totalAmount, totalProfit, status, details } = req.body;
        
        try {
            const result = await sequelize.transaction(async (t) => {
                // Create header
                const header = await CostingHeader.create({
                    totalAmount,
                    totalProfit,
                    status
                }, { transaction: t });

                // Create details
                const detailRecords = details.map(detail => ({
                    ...detail,
                    costingHeaderId: header.id
                }));
                
                await CostingDetail.bulkCreate(detailRecords, { transaction: t });

                return header;
            });

            res.status(201).json({ 
                success: true, 
                id: result.id 
            });
        } catch (error) {
            console.error('Error creating costing:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create costing' 
            });
        }
    },

    getAllCostings: async (req, res) => {
        try {
            const costings = await CostingHeader.findAll({
                include: [{
                    model: CostingDetail,
                    as: 'details'
                }]
            });
            res.json(costings);
        } catch (error) {
            console.error('Error fetching costings:', error);
            res.status(500).json({ error: 'Failed to fetch costings' });
        }
    },

    getCostingById: async (req, res) => {
        try {
            const costing = await CostingHeader.findByPk(req.params.id, {
                include: [{
                    model: CostingDetail,
                    as: 'details'
                }]
            });
            if (!costing) {
                return res.status(404).json({ error: 'Costing not found' });
            }
            res.json(costing);
        } catch (error) {
            console.error('Error fetching costing:', error);
            res.status(500).json({ error: 'Failed to fetch costing' });
        }
    }
};

module.exports = CostingController;