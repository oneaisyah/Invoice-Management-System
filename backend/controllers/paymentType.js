const { getPaymentTypeCSV } = require('../pipelines/paymentTypeCSVPipeline');
let PaymentType = require('./../models/paymentType');
const PaymentTypeController = {
    getCSV: async (req, res) => {
        try {
            const csvString = await getPaymentTypeCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="paymentTypes.csv"');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve payment types as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {

        if (Object.keys(req.query).length === 0) { // https://stackoverflow.com/questions/26292267/how-do-i-check-if-query-string-has-values-in-express-js-node-js

            PaymentType.getAll()
                .then(paymentTypes => { res.status(200).json({ message: "payment types retrieved", paymentTypes }); })
                .catch(err => res.status(400).json({ error: err }));
        } else {
            PaymentType.search(req.query)
                .then(paymentTypes => { res.status(200).json({ message: "payment types retrieved", paymentTypes }); })
                .catch(err => res.status(400).json({ error: err }));
        }
    },
    getById: (req, res) => {
        PaymentType.getById(req.params.id)
            .then(paymentType => {
                if (paymentType == null)
                    res.status(404).json({ message: `paymentType with id ${req.params.id} does not exist` });
                else
                    res.status(200).json({ message: "paymentType retrieved", paymentType });
            })
            .catch(err => res.status(400).json({ error: err }));
    },
    post: (req, res) => {
        PaymentType.create(req.body)
            .then((paymentType) => res.status(201).json({ message: "payment type added", paymentType }))
            .catch(err => res.status(400).json({ error: err }));
    },
    put: (req, res) => {
        PaymentType.updateById(req.params.id, req.body)
            .then(paymentType => res.status(201).json({ message: "payment type updated by id", paymentType }))
            .catch(err => res.json({ error: err }));
    },
    delete: (req, res) => {
        PaymentType.deleteById(req.params.id)
            .then(paymentType => res.status(200).json({ message: "payment type deleted by id", paymentType }))
            .catch(err => res.status(400).json({ error: err }));
    }
}
module.exports = PaymentTypeController;