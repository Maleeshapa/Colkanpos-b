const Cheque = require('../model/Cheque');
const StockPayment = require('../model/StockPayment');
const Supplier = require('../model/Supplier');

async function addCheque(req, res) {
    try {
        const cheques = req.body;

        // Validate input
        if (!Array.isArray(cheques) || cheques.length === 0) {
            return res.status(400).json({ message: 'No cheques provided' });
        }

        const createdCheques = [];

        for (const cheque of cheques) {
            const { chequeNumber, chequeAmount, chequeDate, chequeStatus, supplierId, stockPaymentId } = cheque;

            // Validate related entities
            const supplier = await Supplier.findByPk(supplierId);
            if (!supplier) {
                return res.status(400).json({ message: `Invalid supplier ID: ${supplierId}` });
            }

            const stockPayment = await StockPayment.findByPk(stockPaymentId);
            if (!stockPayment) {
                return res.status(400).json({ message: `Invalid stockPayment ID: ${stockPaymentId}` });
            }

            const newCheque = await Cheque.create({
                chequeNumber,
                chequeAmount,
                chequeDate,
                chequeStatus: 'Pending',
                supplierId,
                stockPaymentId,
            });

            createdCheques.push(newCheque);
        }
        res.status(201).json({
            message: 'New cheque(s) added successfully',
            cheques: createdCheques,
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

module.exports = { addCheque };