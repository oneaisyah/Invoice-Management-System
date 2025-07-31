let Payment = require('./../models/payment');
const { getPaymentCSV } = require('../pipelines/paymentCSVPipeline.js');
const PaymentController = {

    getCSV: async (req, res) => {
        try {
            const csvString = await getPaymentCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"');
            res.header('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve invoices as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {
        if (Object.keys(req.query).length === 0) { // https://stackoverflow.com/questions/26292267/how-do-i-check-if-query-string-has-values-in-express-js-node-js
            Payment.getAll(req.query)
                .then((payments) => {
                    res.status(200).json({ message: "payments retrieved", payments });
                }).catch((err) => {
                    res.status(400).json({ message: 'could not retrieve payments', error: { message: err.message, name: err.name } });
                });
        }
        else {
            Payment.search(req.query)
                .then((payments) => {
                    res.status(200).json({ message: "payments retrieved", payments });
                }).catch((err) => {
                    res.status(400).json({ message: 'could not retrieve payments', error: { message: err.message, name: err.name } });
                });
        }

    },
    getById: (req, res) => {
        Payment.getById(req.params.id, req.query)
            .then(payment => {
                if (payment == null)
                    res.status(404).json({ error: `payment with id ${req.params.id} does not exist` });
                else
                    res.status(200).json({ message: "payment retrieved", payment });
            })
            .catch(err => { res.status(400).json({ error: err }) });
    },
    post: (req, res) => {
        Payment.create(req.body)
            .then((payment) => res.status(201).json({ message: 'payment created', payment }))
            .catch((err) => (res.status(400).json({ error: err })));

    },
    put: (req, res) => {
        const newDoc = {
            amount: req.body.amount,
            type: req.body.type,
            dateOfPayment: req.body.dateOfPayment,
            referenceNumber: req.body.referenceNumber,
            recipientName: req.body.recipientName
        };
        Payment.updateById(req.params.id, newDoc)
            .then((payment) => res.status(201).json({ message: 'payment updated by id', payment }))
            .catch((err) => (res.status(400).json({ error: err })));
    },
    delete: (req, res) => {
        Payment.deleteById(req.params.id)
            .then(payment => {
                res.status(200).json({ message: "payment deleted by id", payment });
            })
            .catch(err => res.status(400).json({ 'error': err }));
    }
}
module.exports = PaymentController;