let Invoice = require('./../models/invoice.js');
const getFilter = require("../utils/filter/invoice");

const invoicePipeline = () => [
    {
        $unwind: {
            path: '$productIDPriceQuantity',
            preserveNullAndEmptyArrays: true // This is necessary:
            // When you perform the $unwind stage on an empty array, 
            // it results in an empty pipeline, and the subsequent 
            // $lookup stage will not be able to find any matches, leading to an empty result.
        }
    },
    {
        $lookup: {
            from: 'products', // Replace with the name of the collection
            localField: 'productIDPriceQuantity.productID',
            foreignField: '_id',
            as: 'productData'
        }
    },
    {
        $unwind: {
            path: '$productData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'paymenttypes',
            localField: 'paymentType',
            foreignField: '_id',
            as: 'paymentType'
        }
    },
    {
        $unwind: {
            path: '$paymentType',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplier',
            foreignField: '_id',
            as: 'supplier'
        }
    },
    {
        $unwind: {
            path: '$supplier',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'productIDPriceQuantity._id': '$productData._id',
            'productIDPriceQuantity.name': '$productData.name',
            'productIDPriceQuantity.price': 1,
            'productIDPriceQuantity.quantity': 1,
            'invoiceID': 1,
            'supplier.name': 1,
            'supplier.address': 1,
            'supplier.uen': 1,
            'dateOfPurchase': 1,
            'paymentType.name': 1,
            'paid': 1,
            'totalPriceBeforeGST': 1,
            'totalPriceAfterGST': 1
        }
    }
];
const invoiceFilterPipeline = (ids) => {
    const match = [{
        $match: { _id: { $in: ids } }
    }];
    const unfilteredPipeline = invoicePipeline()
    const filteredPipeline = match.concat(unfilteredPipeline);
    return filteredPipeline;
};
async function getInvoiceCSV(reqQuery) {

    const filteredInvoices = await Invoice.search(reqQuery);
    const ids = filteredInvoices.map(invoice => invoice._id);
    const invoices = await Invoice.aggregate(invoiceFilterPipeline(ids));
    const csvData = [];
    invoices.forEach((invoice) => {
        const newInvoice = convertToDollars(invoice);
        const productData = newInvoice.productIDPriceQuantity;
        console.log('product data', newInvoice.productIDPriceQuantity);
        csvData.push({
            '_id': newInvoice._id,
            'productIDPriceQuantity._id': productData._id,
            'productIDPriceQuantity.name': productData.name,
            'productIDPriceQuantity.price': productData.price,
            'productIDPriceQuantity.quantity': productData.quantity,
            'invoiceID': newInvoice.invoiceID,
            'supplier.name': newInvoice.supplier.name,
            'supplier.address': newInvoice.supplier.address,
            'supplier.uen': newInvoice.supplier.uen,
            'dateOfPurchase': newInvoice.dateOfPurchase,
            'paymentType.name': newInvoice.paymentType?.name,
            'paid': newInvoice.paid,
            'totalPriceBeforeGST': newInvoice.totalPriceBeforeGST,
            'totalPriceAfterGST': newInvoice.totalPriceAfterGST
        });
    });

    const csvHeaders = [
        { id: '_id', title: 'Internal ID' },
        { id: 'productIDPriceQuantity._id', title: 'Product ID' },
        { id: 'productIDPriceQuantity.name', title: 'Product name' },
        { id: 'productIDPriceQuantity.price', title: 'Product price' },
        { id: 'productIDPriceQuantity.quantity', title: 'Product quantity' },
        { id: 'invoiceID', title: 'Invoice ID' },
        { id: 'supplier.name', title: 'Supplier name' },
        { id: 'supplier.address', title: 'Supplier address' },
        { id: 'supplier.uen', title: 'Supplier UEN' },
        { id: 'dateOfPurchase', title: 'Date of purchase' },
        { id: 'paymentType.name', title: 'Payment type' },
        { id: 'paid', title: 'Invoice paid' },
        { id: 'totalPriceBeforeGST', title: 'Total price before GST' },
        { id: 'totalPriceAfterGST', title: 'Total price after GST' }
    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};
function convertToDollars(invoice) {

    if (invoice.productIDPriceQuantity) {
        const newItem = invoice.productIDPriceQuantity;
        newItem.price = (parseFloat(newItem.price) / 10000).toFixed(2)
        invoice.productIDPriceQuantity = newItem;
    }
    if (invoice.totalPriceAfterGST)
        invoice.totalPriceAfterGST = (invoice.totalPriceAfterGST / 100).toFixed(2);
    if (invoice.totalPriceBeforeGST)
        invoice.totalPriceBeforeGST = (invoice.totalPriceBeforeGST / 100).toFixed(2);
    return invoice;
}
module.exports = {
    getInvoiceCSV
};