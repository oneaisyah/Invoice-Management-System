let Supplier = require('../models/supplier.js');
const getFilter = require("../utils/filter/supplier.js");

const supplierPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $project: {
            '_id': 1,
            'name': 1,
            'address': 1,
            'uen': 1,
        }
    }
];

async function getSupplierCSV(reqQuery) {

    const filter = getFilter(reqQuery)
    const suppliers = await Supplier.aggregate(supplierPipeline(filter))

    const csvData = [];
    suppliers.forEach((supplier) => {
        csvData.push({
            '_id': supplier._id,
            'name': supplier.name,
            'address': supplier.address,
            'uen': supplier.uen,
        });
    });

    const csvHeaders = [
        { id: '_id', title: 'Supplier ID' },
        { id: 'name', title: 'Supplier name' },
        { id: 'address', title: 'Supplier address' },
        { id: "uen", title: 'Supplier UEN' }
    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};

module.exports = {
    getSupplierCSV
};