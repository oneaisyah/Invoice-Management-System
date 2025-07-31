const { getProductCSV } = require('../pipelines/productCSVPipeline');
let Product = require('./../models/product');
//Get all Product documents
const ProductController = {
    getCSV: async (req, res) => {
        try {
            const csvString = await getProductCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve products as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {
        if (Object.keys(req.query).length === 0) { // https://stackoverflow.com/questions/26292267/how-do-i-check-if-query-string-has-values-in-express-js-node-js

            Product.getAll()
                .then(products => res.status(200).json({ message: "retrieved all products", products }))
                .catch(err => res.status(400).json({ error: err }));
        } else {
            Product.search(req.query)
                .then(products => res.status(200).json({ message: "retrieved all products", products }))
                .catch(err => res.status(400).json({ error: err }));
        }
    },
    getById: (req, res) => {
        Product.getById(req.params.id)
            .then(product => {
                if (product == null)
                    res.status(404).json({ message: `product with id ${req.params.id} does not exist` });
                else
                    res.status(200).json({ message: "product retrieved", product });
            })
            .catch(err => res.status(400).json({ error: err }));
    },
    post: (req, res) => {
        Product.create(req.body)
            .then((product) => res.status(201).json({ message: "product added", product }))
            .catch(err => { console.log(err); res.status(400).json({ error: err.message }) });
    },
    put: (req, res) => {
        Product.updateById(req.params.id, req.body)
            .then(product => res.status(201).json({ message: "product updated by id", product }))
            .catch(err => res.json({ error: err }));
    },
    delete: (req, res) => {
        Product.deleteById(req.params.id)
            .then(product => res.status(200).json({ message: "product deleted by id", product }))
            .catch(err => res.status(400).json({ error: err }));
    }
}
module.exports = ProductController;