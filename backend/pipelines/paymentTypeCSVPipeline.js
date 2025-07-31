let PaymentType = require('../models/paymentType.js');
const getFilter = require("../utils/filter/paymentType.js");

const paymentTypePipeline = (filter) => [
    {
        $match: filter
    },
    {
        $project: {
            '_id': 1,
            'name': 1,
        }
    }
];

async function getPaymentTypeCSV(reqQuery) {
    
    const filter = getFilter(reqQuery)

    const paymentTypes = await PaymentType.aggregate(paymentTypePipeline(filter))

    const csvData = [];
    paymentTypes.forEach((paymentType) => {
        csvData.push({
            '_id': paymentType._id,
            'name': paymentType.name
        });
    });

    const csvHeaders = [
        { id: '_id', title: 'Payment type ID'},
        { id: 'name', title: 'Payment type' }
    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });


    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};

module.exports = {
    getPaymentTypeCSV
};