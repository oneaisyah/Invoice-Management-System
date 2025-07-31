
let Invoice = require('./../models/invoice.js');
const { getInvoiceCSV } = require('../pipelines/invoiceCSVPipeline.js');
const ocr = require('../utils/ocr/ocr');
const dataBucket = require('../utils/data_bucket/dataBucket.js');
const invoiceController = {
    getCSV: async (req, res) => {
        try {
            const csvString = await getInvoiceCSV(req.query);
            res.setHeader('Content-Disposition', 'attachment; filename="invoices.csv"');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csvString);
        } catch (err) {
            res.status(400).json({ 'message': 'Could not retrieve invoices as csv', 'error': { name: err.name, message: err.message, stacktrace: err.stacktrace } });
            throw err;
        }
    },
    get: (req, res) => {
        Invoice.search(req.query)
            .then((invoices) => {
                res.status(200).json({ message: "invoices retrieved", invoices });
            }).catch((err) => {
                res.status(400).json({ message: 'could not retrieve invoices', error: { message: err.message, name: err.name } });
            });
    },
    getById: (req, res) => {
        Invoice.getById(req.params.id, req.query)
            .then((invoice) => {
                if (!invoice)
                    res.status(404).send({ message: `invoice with id ${req.params.id} does not exist` });
                else
                    res.status(200).send({ message: "invoices retrieved", invoice });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({ message: 'Invoice not found!', error: err })
            });
    },
    post: (req, res) => {
        Invoice.create(req.body)
            .then((invoice) => {
                res.status(201).json({ message: 'Invoice was added successfully', invoice });
            }).catch((err) => {
                res.status(400).json({ message: 'Invoice was not added successfully.', error: err });
            });
    },
    put: (req, res) => {
        Invoice.updateById(req.params.id, req.body)
            .then(invoice => {
                res.status(201).json({ message: "invoice updated", invoice });
            })
            .catch(err => { console.log(err); res.status(400).json({ error: err }); });
    },
    delete: (req, res) => {
        Invoice.deleteById(req.params.id)
            .then((invoice) => {
                res.status(200).json({ message: 'Invoice is deleted successfully', invoice })
            }).catch((err) => {
                res.status(400).json({ message: 'Invoice was not deleted! It is possible that it does not exist!', error: err })
            });
    },
    processImage: async (req, res) => {
        try {
            if (req.file) {
                const extractedData = await ocr.run(`${process.cwd()}/${req.file.path}`);
                res.status(200).json({ message: "data extracted from file", extractedData });
            }
            else {
                res.status(400).json({ message: "data could not be extracted", error: { name: "FileError", message: "File not provided" } })
            }
        }
        catch (err) {

            res.status(400).json({ message: "data could not be extracted", error: { name: err.name, message: err.message } })
            throw err;
        }
    },
    uploadImage: async (req, res) => {
        try {
            if (req.file) {
                const mediaLink = await dataBucket.uploadFile(`${process.cwd()}/${req.file.path}`, `${req.file.path}`);
                res.status(200).json({ message: "image uploaded to data bucket", mediaLink })
            }
        }
        catch (err) {
            res.status(400).json({ message: "image could not be uploaded", error: { name: err.name, message: err.message } })
        }
    }
}
module.exports = invoiceController;
