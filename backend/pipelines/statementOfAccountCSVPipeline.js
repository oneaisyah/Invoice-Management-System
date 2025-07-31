let StatementOfAccount = require('../models/statementOfAccount.js');
const getFilter = require("../utils/filter/statementOfAccount.js");
const statementOfAccountPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $unwind: {
            path: '$payments',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'payments',
            from: 'payments',
            localField: 'payments',
            foreignField: '_id',
            as: 'paymentsData'
        }
    },
    {
        $unwind: {
            path: '$paymentsData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$invoices',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'invoices',
            localField: 'invoices',
            foreignField: '_id',
            as: 'invoicesData'
        }
    },
    {
        $unwind: {
            path: '$invoicesData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplier',
            foreignField: '_id',
            as: 'supplierData'
        }
    },
    {
        $unwind: {
            path: '$supplierData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'referenceNumber': 1,
            'invoices._id': '$invoicesData._id',
            'dateIssued': 1,
            'dateIssued': 1,
            'dateDue': 1,
            'supplier._id': '$supplierData._id',
            'supplier.name': '$supplierData.name',
            'supplier.address': '$supplierData.address',
            'supplier.uen': '$supplierData.uen',
            'supplier.uen': '$supplierData.uen',
            'payments._id': '$paymentsData._id',
            'payments.amount': '$paymentsData.amount',
            'payments.amount': '$paymentsData.amount',
            'amountOutstanding': 1,
            'amountPaid': 1,
            'amountOverdue': 1
        }
    }
];
async function getStatementOfAccountCSV(reqQuery) {


    const filter = getFilter(reqQuery)
    const statementOfAccounts = await StatementOfAccount.aggregate(statementOfAccountPipeline(filter))

    const csvData = [];

    statementOfAccounts.forEach((statement) => {
        csvData.push({
            '_id': statement._id,
            'referenceNumber': statement.referenceNumber,
            'invoices._id': statement.invoices._id,
            'dateIssued': statement.dateIssued,
            'dateIssued': statement.dateIssued,
            'dateDue': statement.dateDue,
            'supplier._id': statement.supplier._id,
            'supplier.name': statement.supplier.name,
            'supplier.address': statement.supplier.address,
            'supplier.uen': statement.supplier.uen,
            'supplier.uen': statement.supplier.uen,
            'payments._id': statement.payments._id,
            'payments.amount': statement.payments.amount,
            'payments.amount': statement.payments.amount,
            'amountOutstanding': statement.amountOutstanding,
            'amountPaid': statement.amountPaid,
            'amountOverdue': statement.amountOverdue
        });
    });

    const csvHeaders = [
        { id: '_id', title: 'Internal ID' },
        { id: '_id', title: 'Internal ID' },
        { id: 'referenceNumber', title: 'Reference number' },
        { id: 'invoices._id', title: 'Invoice ID' },
        { id: 'dateDue', title: 'Date due' },
        { id: 'supplier._id', title: 'Supplier ID' },
        { id: 'supplier.name', title: 'Supplier name' },
        { id: 'supplier.address', title: 'Supplier address' },
        { id: 'supplier.uen', title: 'Supplier UEN' },
        { id: 'payments._id', title: 'Payments id' },
        { id: 'payments.amount', title: 'Payments amount' },
        { id: 'supplier.uen', title: 'Supplier UEN' },
        { id: 'payments._id', title: 'Payments id' },
        { id: 'payments.amount', title: 'Payments amount' },
        { id: 'amountOutstanding', title: 'Amount outstanding' },
        { id: 'amountPaid', title: 'Amount paid' },
        { id: 'amountOverdue', title: 'Amount overdue' },


    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};

module.exports = {
    getStatementOfAccountCSV
};