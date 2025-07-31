let Product = require('../models/product.js');
const getFilter = require("../utils/filter/product.js");

const productPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $project: {
            '_id': 1,
            'name': 1,
            'upc': 1
        }
    }
];

async function getProductCSV(reqQuery) {
    
    const filter = getFilter(reqQuery)
    const products = await Product.aggregate(productPipeline(filter))

    const csvData = [];
    products.forEach((product) => {
        csvData.push({
            'productID': product._id,
            'productName': product.name,
            'productUPC': product.upc,
        });
    });

    const csvHeaders = [
        { id: 'productID', title: 'Product ID'},
        { id: 'productName', title: 'Product name' },
        { id: 'productUPC', title: 'Product UPC' }
    ]

    const createCSVStringifier = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCSVStringifier({
        header: csvHeaders
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
};

module.exports = {
    getProductCSV
};