const invoicePipeline = (filter) => [
    {
        $match: filter
    },
    {
        $unwind: '$productIDPriceQuantity'
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
        $unwind: '$productData'
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
        $unwind: '$supplier'
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
        $unwind: '$paymentType'
    },
    {
        $project: {
            _id: 1,
            'productIDPriceQuantity._id': '$productData._id',
            'productIDPriceQuantity.name': '$productData.name',
            'productIDPriceQuantity.price': 1,
            'productIDPriceQuantity.quantity': 1,
            'invoiceID': 1,
            'supplier.name': 1,
            'supplier.address': 1,
            'dateOfPurchase': 1,
            'paymentType.name': 1,
            'paid': 1,
            'totalPriceBeforeGST': 1,
            'totalPriceAfterGST': 1
        }
    }
];
const statementOfAccountPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $unwind: '$payments'
    },
    {
        $lookup: {
            from: 'payments', // Replace with the name of the collection
            localField: 'payments',
            foreignField: '_id',
            as: 'paymentsData'
        }
    },
    {
        $unwind: '$paymentsData'
    },
    {
        $unwind: '$invoices'
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
        $unwind: '$invoicesData'
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
        $unwind: '$supplierData'
    },
    {
        $project: {
            _id: 1,
            'referenceNumber': 1,
            'invoices._id': '$invoicesData._id',
            'dateDue': 1,
            'supplier._id': '$supplierData._id',
            'supplier.name': '$supplierData.name',
            'payments._id': '$paymentsData._id',
            'supplier.name': 1,
            'supplier.address': 1,
            'dateOfPurchase': 1,
            'paymentType.name': 1,
            'paid': 1,
            'totalPriceBeforeGST': 1,
            'totalPriceAfterGST': 1
        }
    }
];

function capitaliseFirstLetter(string) { // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertJSONToArray(JSONObject) {
    var result = [];

    for (var i in JSONObject)
        result.push(i);
    return result
}

function flattenInvoice(invoices, suppliers, products, paymentTypes) { //* Flattens the JSON object from database. Helper function for converting to CSV. 


    console.log("🚀 ~ file: convertToCSVHelper.js:29 ~ flattenInvoice ~ products:", products);


    console.log("🚀 ~ file: convertToCSVHelper.js:29 ~ flattenInvoice ~ suppliers:", suppliers);
    console.log("🚀 ~ file: convertToCSVHelper.js:29 ~ flattenInvoice ~ paymentTypes:", paymentTypes);

    /**------------------------------------------------------------------------
     * Extraction of headers section
     * Extracts out the headers into an array
     * Take note that for productIDPriceQuantity, if you want the price attribute, 
     * append to the end. Same for ID or quantity.
     *------------------------------------------------------------------------**/
    let headersJSON = {};

    invoices.forEach((invoice) => {
        for (const [key, value] of Object.entries(invoice)) {
            if (key == "productIDPriceQuantity") {
                if (invoice.productIDPriceQuantity.length == 0) {
                    if (key != "productIDPriceQuantity") {
                        headersJSON[key] = null;
                    }
                } else {
                    for (const [product, productFields] of Object.entries(invoice.productIDPriceQuantity)) {
                        for (const [productKey, productValue] of Object.entries(productFields)) {
                            if (productKey == "_id") { // We just want to run the following code once.
                                if (products.length > 0) {
                                    let correspondingProductData = products.find((product) => productValue);

                                    for (const [productExtraKey, productExtraValue] of Object.entries(correspondingProductData)) {
                                        if (!(productExtraKey == "_id")) {
                                            headersJSON["productIDPriceQuantity" + capitaliseFirstLetter(productExtraKey)] = null;
                                        }
                                    }

                                } else {
                                    console.log("You have no products")
                                }
                            }
                            else {
                                console.log('productKey', productKey);
                                headersJSON["productIDPriceQuantity" + capitaliseFirstLetter(productKey)] = null;
                            }
                        }

                    }
                }
            } else if (key == "supplier") {
                let correspondingSupplierData = suppliers.find((supplier) => supplier._id);

                for (const [supplierKey, supplierValue] of Object.entries(correspondingSupplierData)) {
                    if (supplierKey == "supplierId") {
                        headersJSON[supplierKey] = null;
                    } else {

                        headersJSON["supplier" + capitaliseFirstLetter(supplierKey)] = null;
                    }
                }

            } else if (key == "paymentType") {
                let correspondingPaymentType = paymentTypes.find((paymentType) => paymentType._id);

                for (const [paymentTypeKey, paymentTypeValue] of Object.entries(correspondingPaymentType)) {
                    headersJSON["paymentType" + capitaliseFirstLetter(paymentTypeKey)] = null;
                }


            } else {
                headersJSON[key] = null;
            }


        }
    })
    headersArray = convertJSONToArray(headersJSON);
    headersArray.push('\n')
    console.log('=<>headersArray', headersArray);
    /**------------------------------------------------------------------------
     * End of headers extraction;
     * The following is the start of flattening the JSON and storing into an array
     *------------------------------------------------------------------------**/

    let csvLinesForAllInvoices = [];
    invoices.forEach((invoice) => {
        if (invoice.hasOwnProperty('productIDPriceQuantity')) {
            const numberOfProducts = invoice.productIDPriceQuantity.length;

            if (numberOfProducts == 0) {

                let csvLinesForOneInvoice = [];
                orderedJSONStructure = {};
                headersArray.forEach((header) => {
                    if (header.includes('productIDPriceQuantity')) {

                        orderedJSONStructure[header] = invoice['productIDPriceQuantity']; // should be empty array

                    } else if (header.includes('supplier')) {
                        let currentSupplier = invoice.supplier

                        console.log("🚀 ~ file: convertToCSVHelper.js:157 ~ headersArray.forEach ~ currentSupplier:", currentSupplier);

                        let correspondingSupplierData = suppliers.find(supplier => currentSupplier._id);

                        console.log("🚀 ~ file: convertToCSVHelper.js:158 ~ headersArray.forEach ~ correspondingSupplierData:", correspondingSupplierData);
                        if (correspondingSupplierData) {
                            if (header == 'supplier_id') {
                                orderedJSONStructure[header] = correspondingSupplierData._id;
                            }
                            if (header == 'supplierName') {
                                orderedJSONStructure[header] = correspondingSupplierData.name;
                            }
                            if (header == 'supplierAddress') {
                                orderedJSONStructure[header] = correspondingSupplierData.address;
                            }

                        } else {
                            orderedJSONStructure[header] = "";

                        }

                    } else if (header.includes('paymentType')) {
                        let currentPaymentType = invoice.paymentType
                        let correspondingPaymentTypeData = paymentTypes.find(paymentType => currentPaymentType._id);

                        if (correspondingPaymentTypeData) {
                            if (header == 'paymentType_id') {
                                orderedJSONStructure[header] = correspondingPaymentTypeData._id;
                            }
                            if (header == 'paymentTypeName') {
                                orderedJSONStructure[header] = correspondingPaymentTypeData.name;
                            }

                        } else {
                            orderedJSONStructure[header] = "";

                        }

                    } else if (invoice.hasOwnProperty(header)) {
                        orderedJSONStructure[header] = invoice[header];

                    } else {
                        orderedJSONStructure[header] = "";
                    }
                })

                for (const [key, value] of Object.entries(orderedJSONStructure)) {

                    csvLinesForOneInvoice.push(value);
                }
                csvLinesForOneInvoice.push('\n');
                csvLinesForAllInvoices.push(csvLinesForOneInvoice);
            } else { // multiple products
                for (let i = 0; i < numberOfProducts; i++) {
                    let csvLinesForOneInvoice = [];
                    orderedJSONStructure = {};
                    console.log('===headersArray===', headersArray);
                    headersArray.forEach((header) => {

                        if (header.includes('productIDPriceQuantity')) {
                            let currentProduct = invoice.productIDPriceQuantity[i];
                            // console.log(`products ${JSON.stringify(products)}`);
                            // console.log(`currentProduct ${JSON.stringify(currentProduct)}`)
                            let correspondingProductData = {};
                            correspondingProductData = products.find(product => product._id.toString() == currentProduct.productID.toString());
                            console.log(JSON.stringify(correspondingProductData));

                            if (header == 'productIDPriceQuantityProductID') {
                                orderedJSONStructure[header] = currentProduct.productID;
                            }
                            if (header == 'productIDPriceQuantityPrice') {
                                orderedJSONStructure[header] = currentProduct.price;
                            }
                            if (header == 'productIDPriceQuantityQuantity') {
                                orderedJSONStructure[header] = currentProduct.quantity;
                            }
                            if (header == 'productIDPriceQuantityName') {
                                orderedJSONStructure[header] = correspondingProductData.name;
                            }
                            if (header == 'productIDPriceQuantityUpc') {
                                orderedJSONStructure[header] = correspondingProductData.upc;
                            }
                        } else if (header.includes('supplier')) {
                            let currentSupplier = invoice.supplier
                            console.log(`currentSupplier:\n${currentSupplier}`);
                            console.log(`suppliers:\n${JSON.stringify(suppliers)} `);
                            let correspondingSupplierData = {};
                            correspondingSupplierData = suppliers.find(supplier => supplier._id.toString() == currentSupplier.toString());

                            console.log(correspondingSupplierData);
                            if (header == 'supplier_id') {
                                orderedJSONStructure[header] = correspondingSupplierData._id;
                            }
                            else if (header == 'supplierName') {

                                orderedJSONStructure[header] = correspondingSupplierData.name;
                            }
                            else if (header == 'supplierAddress') {

                                orderedJSONStructure[header] = correspondingSupplierData.address;
                            } else {
                                orderedJSONStructure[header] = "";

                            }

                        } else if (header.includes('paymentType')) {
                            console.log(invoice)
                            let currentPaymentType = invoice.paymentType
                            let correspondingPaymentTypeData = paymentTypes.find(paymentType => currentPaymentType._id);

                            console.log("🚀 ~ file: convertToCSVHelper.js:228 ~ headersArray.forEach ~ correspondingPaymentTypeData:", correspondingPaymentTypeData);


                            if (correspondingPaymentTypeData) {
                                if (header == 'paymentType_id') {
                                    orderedJSONStructure[header] = correspondingPaymentTypeData._id;
                                }
                                if (header == 'paymentTypeName') {
                                    orderedJSONStructure[header] = correspondingPaymentTypeData.name;
                                }

                            } else {
                                orderedJSONStructure[header] = "";

                            }

                        } else if (invoice.hasOwnProperty(header)) {
                            orderedJSONStructure[header] = invoice[header];

                        } else {
                            orderedJSONStructure[header] = "";
                        }
                    })

                    for (const [key, value] of Object.entries(orderedJSONStructure)) {
                        csvLinesForOneInvoice.push(value);
                    }
                    csvLinesForOneInvoice.push('\n');
                    csvLinesForAllInvoices.push(csvLinesForOneInvoice);
                }
            }
        } else { // invoice totally does not have any products
            let csvLinesForOneInvoice = [];
            orderedJSONStructure = {};
            headersArray.forEach((header) => {
                if (header.includes('supplier')) {
                    let currentSupplier = invoice.supplier
                    let correspondingSupplierData = suppliers.find(supplier => currentSupplier._id);

                    if (correspondingSupplierData) {
                        if (header == 'supplier_id') {
                            orderedJSONStructure[header] = correspondingSupplierData._id;
                        }
                        if (header == 'supplierName') {
                            orderedJSONStructure[header] = correspondingSupplierData.name;
                        }
                        if (header == 'supplierAddress') {
                            orderedJSONStructure[header] = correspondingSupplierData.address;
                        }

                    } else {
                        orderedJSONStructure[header] = "";

                    }

                } else if (header.includes('paymentType')) {
                    let currentPaymentType = invoice.paymentType
                    let correspondingPaymentTypeData = paymentTypes.find(paymentType => currentPaymentType._id);

                    console.log("🚀 ~ file: convertToCSVHelper.js:294 ~ headersArray.forEach ~ correspondingPaymentTypeData:", correspondingPaymentTypeData);


                    if (correspondingPaymentTypeData) {
                        if (header == 'paymentType_id') {
                            orderedJSONStructure[header] = correspondingPaymentTypeData._id;
                        }
                        if (header == 'paymentTypeName') {
                            orderedJSONStructure[header] = correspondingPaymentTypeData.name;
                        }

                    } else {
                        orderedJSONStructure[header] = "";

                    }

                } else if (invoice.hasOwnProperty(header)) {
                    orderedJSONStructure[header] = invoice[header];

                } else {
                    orderedJSONStructure[header] = "";
                }
            })

            for (const [key, value] of Object.entries(orderedJSONStructure)) {
                csvLinesForOneInvoice.push(value);
            }
            csvLinesForOneInvoice.push('\n');
            csvLinesForAllInvoices.push(csvLinesForOneInvoice)


        }
    })
    return [headersArray, csvLinesForAllInvoices];
}

function flattenStatementOfAccount(statementOfAccounts, suppliers) {

    let headersJSON = {};

    statementOfAccounts.forEach((statementOfAccount) => {
        for (let [key, value] of Object.entries(statementOfAccount)) {
            if (key == "supplier") {
                let correspondingSupplierData = suppliers.find((supplier) => supplier._id);
                for (const [supplierKey, supplierValue] of Object.entries(correspondingSupplierData)) {
                    if (supplierKey == "supplierId") {
                        headersJSON[supplierKey] = null;
                    } else {

                        headersJSON["supplier" + capitaliseFirstLetter(supplierKey)] = null;
                    }
                }
            } else {
                headersJSON[key] = null;
            }
        }
    })
    headersArray = convertJSONToArray(headersJSON);
    headersArray.push('\n');
    console.log(headersArray);
    /**------------------------------------------------------------------------
     * End of headers extraction;
     * The following is the start of flattening the JSON and storing into an array
     *------------------------------------------------------------------------**/

    let csvLinesForAllStatementOfAccounts = [];
    statementOfAccounts.forEach((statementOfAccount) => {
        if (statementOfAccount.hasOwnProperty('invoices')) {
            numberOfInvoices = statementOfAccount.invoices.length;
            if (numberOfInvoices == 0) {

                let csvLinesForOneStatementOfAccount = [];
                orderedJSONStructure = {};
                headersArray.forEach((header) => {
                    if (header.includes('supplier')) {
                        let correspondingSupplierData = suppliers.find((supplier) => supplier._id);
                        if (correspondingSupplierData) {

                            if ((header == 'supplier_id') && (correspondingSupplierData._id)) {
                                orderedJSONStructure[header] = correspondingSupplierData._id;
                            }
                            else if ((header == 'supplierName') && (correspondingSupplierData.name)) {
                                orderedJSONStructure[header] = correspondingSupplierData.name;
                            }
                            else if ((header == 'supplierAddress') && (correspondingSupplierData.address)) {
                                orderedJSONStructure[header] = correspondingSupplierData.address;
                            } else {
                                orderedJSONStructure[header] = ""
                            }
                        }
                    } else if (statementOfAccount.hasOwnProperty(header)) {
                        orderedJSONStructure[header] = statementOfAccount[header];
                    } else {
                        orderedJSONStructure[header] = "";
                    }
                })

                for (const [key, value] of Object.entries(orderedJSONStructure)) {
                    csvLinesForOneStatementOfAccount.push(value);
                }
                csvLinesForOneStatementOfAccount.push('\n');
                csvLinesForAllStatementOfAccounts.push(csvLinesForOneStatementOfAccount);
            } else {
                for (let i = 0; i < numberOfInvoices; i++) {
                    let csvLinesForOneStatementOfAccount = [];
                    orderedJSONStructure = {};
                    headersArray.forEach((header) => {
                        if (header.includes('supplier')) {
                            let correspondingSupplierData = suppliers.find((supplier) => supplier._id);

                            if (correspondingSupplierData) {
                                if ((header == 'supplier_id') && (correspondingSupplierData._id)) {
                                    orderedJSONStructure[header] = correspondingSupplierData._id;

                                }
                                else if ((header == 'supplierName') && (correspondingSupplierData.name)) {
                                    orderedJSONStructure[header] = correspondingSupplierData.name;
                                }
                                else if ((header == 'supplierAddress') && (correspondingSupplierData.address)) {
                                    orderedJSONStructure[header] = correspondingSupplierData.address;
                                } else {
                                    orderedJSONStructure[header] = ""
                                }
                            }
                        } else if (statementOfAccount.hasOwnProperty(header)) {
                            orderedJSONStructure[header] = statementOfAccount[header];
                        } else {
                            orderedJSONStructure[header] = "";
                        }
                    })

                    for (const [key, value] of Object.entries(orderedJSONStructure)) {
                        if (key == "invoices") {
                            csvLinesForOneStatementOfAccount.push(value[i]);
                        } else {
                            csvLinesForOneStatementOfAccount.push(value);
                        }
                    }
                    csvLinesForOneStatementOfAccount.push('\n');
                    csvLinesForAllStatementOfAccounts.push(csvLinesForOneStatementOfAccount)
                }
            }
        } else {
            let csvLinesForOneStatementOfAccount = [];
            orderedJSONStructure = {};
            headersArray.forEach((header) => {
                if (header.includes('supplier')) {
                    let correspondingSupplierData = suppliers.find((supplier) => supplier._id);
                    if (correspondingSupplierData) {

                        if ((header == 'supplier_id') && (correspondingSupplierData._id)) {
                            orderedJSONStructure[header] = correspondingSupplierData._id;
                        }
                        else if ((header == 'supplierName') && (correspondingSupplierData.name)) {
                            orderedJSONStructure[header] = correspondingSupplierData.name;
                        }
                        else if ((header == 'supplierAddress') && (correspondingSupplierData.address)) {
                            orderedJSONStructure[header] = correspondingSupplierData.address;
                        } else {
                            orderedJSONStructure[header] = ""
                        }
                    }
                } else if (statementOfAccount.hasOwnProperty(header)) {
                    orderedJSONStructure[header] = statementOfAccount[header];
                } else {
                    orderedJSONStructure[header] = "";
                }
            })

            for (const [key, value] of Object.entries(orderedJSONStructure)) {
                csvLinesForOneStatementOfAccount.push(value);
            }
            csvLinesForOneStatementOfAccount.push('\n');
            csvLinesForAllStatementOfAccounts.push(csvLinesForOneStatementOfAccount)
        }
    })
    return [headersArray, csvLinesForAllStatementOfAccounts];
}

function getHeaderAndRowsFromFlattenedJSON(arrayOfJSONObjects) {
    let headersJSON = {};
    arrayOfJSONObjects.forEach((JSONObject) => {
        for (let [key, value] of Object.entries(JSONObject)) {
            headersJSON[key] = null;
        }
    })


    headersArray = convertJSONToArray(headersJSON)
    headersArray.push('\n');
    //console.log(headersArray);
    /**------------------------------------------------------------------------
     * End of headers extraction;
     * The following is the start of flattening the JSON and storing into an array
     *------------------------------------------------------------------------**/

    let csvLinesForAllJSONObjects = [];
    arrayOfJSONObjects.forEach((JSONObject) => {
        let csvLinesForOneJSONObject = [];
        orderedJSONStructure = {};
        headersArray.forEach((header) => {
            if (JSONObject.hasOwnProperty(header)) {
                orderedJSONStructure[header] = JSONObject[header];
            } else {
                orderedJSONStructure[header] = "";
            }
        })

        for (const [key, value] of Object.entries(orderedJSONStructure)) {
            csvLinesForOneJSONObject.push(value);
        }
        csvLinesForOneJSONObject.push('\n');
        csvLinesForAllJSONObjects.push(csvLinesForOneJSONObject);
    })
    return [headersArray, csvLinesForAllJSONObjects];
}

module.exports = {
    flattenInvoice, flattenStatementOfAccount, getHeaderAndRowsFromFlattenedJSON, invoicePipeline
};