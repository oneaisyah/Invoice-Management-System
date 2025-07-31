let Payment = require('../models/payment.js');
const getFilter = require("../utils/filter/payment");

const paymentPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $unwind: {
            path: '$type',
            preserveNullAndEmptyArrays: true // This is necessary:
            // When you perform the $unwind stage on an empty array, 
            // it results in an empty pipeline, and the subsequent 
            // $lookup stage will not be able to find any matches, leading to an empty result.
        }
    },
    {
        $lookup: {
            from: 'paymenttypes', // Replace with the name of the collection
            localField: 'type',
            foreignField: '_id',
            as: 'paymentTypesData'
        }
    },
    {
        $unwind: {
            path: '$paymentTypesData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'amount': 1,
            'paymentTypeID': '$paymentTypesData._id',
            'paymentTypeName': '$paymentTypesData.name',
            'dateOfPayment': 1,
            'referenceNumber': 1,
            'recipientName': 1,
        }
    }
];

async function getPaymentCSV(reqQuery) {
    
    const filter = getFilter(reqQuery)
    const payments = await Payment.aggregate(paymentPipeline(filter))

    const csvData = [];
    payments.forEach((payment) => {
        csvData.push({
            '_id': payment._id,
            'amount': payment.amount,
            'paymentTypeID': payment.paymentTypeID,
            'paymentTypeName': payment.paymentTypeName,
            'dateOfPayment': payment.dateOfPayment,
            'referenceNumber': payment.referenceNumber,
            'recipientName': payment.recipientName,
        });
    });

    const csvHeaders = [
        { id: '_id', title: 'Internal ID'},
        { id: 'amount', title: 'Payment amount' },
        { id: 'paymentTypeID', title: 'Payment type ID' },
        { id: 'paymentTypeName', title: 'Payment type ID name' },
        { id: 'dateOfPayment', title: 'Date of payment' },
        { id: 'referenceNumber', title: 'Reference Number' },
        { id: 'recipientName', title: 'Recipient' },
    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};

module.exports = {
    getPaymentCSV
};