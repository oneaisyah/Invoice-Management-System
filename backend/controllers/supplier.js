let Supplier = require('../models/supplier');
const { getSupplierCSV } = require('../pipelines/supplierCSVPipeline');
const SupplierController = {
    getCSV: async (req, res) => {
        try {
            const csvString = await getSupplierCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="suppliers.csv"');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve suppliers as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {
        if (Object.keys(req.query).length === 0) { // https://stackoverflow.com/questions/26292267/how-do-i-check-if-query-string-has-values-in-express-js-node-js
            Supplier.getAll()
                .then((suppliers) => {
                    // console.log('all suppliers', suppliers)
                    res.status(200).json({ message: "suppliers retrieved", suppliers });
                }).catch((err) => {
                    res.status(400).json({ message: 'could not retrieve suppliers', error: { message: err.message, name: err.name } });
                });
        } else {
            Supplier.search(req.query)
                .then((suppliers) => {
                    // console.log('some suppliers', suppliers)

                    res.status(200).json({ message: "suppliers retrieved", suppliers });
                }).catch((err) => {
                    res.status(400).json({ message: 'could not retrieve suppliers', error: { message: err.message, name: err.name } });
                });
        }
    },
    getById: (req, res) => {
        Supplier.getById(req.params.id)
            .then(supplier => {
                if (supplier == null)
                    res.status(404).json({ message: `supplier with id ${req.params.id} does not exist` });
                else
                    res.status(200).json({ message: "supplier retrieved", supplier });
            })
            .catch(err => res.status(400).json({ error: err }));
    },
    post: (req, res) => {
        Supplier.create(req.body)
            .then((supplier) => res.status(201).json({ message: "supplier added", supplier }))
            .catch(err => res.status(400).json({ error: err }));
    },
    put: (req, res) => {

        Supplier.updateById(req.params.id, req.body)
            .then(supplier => res.status(201).json({ message: "supplier updated by id", supplier }))
            .catch(err => res.json({ error: err }));
    },
    delete: (req, res) => {
        Supplier.deleteById(req.params.id)
            .then(supplier => res.status(200).json({ message: "supplier deleted by id", supplier }))
            .catch(err => res.status(400).json({ error: err }));
    }
};
module.exports = SupplierController;