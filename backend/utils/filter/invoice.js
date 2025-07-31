
function processNestedQuery(filters, reqQuery, query) {

    const outsideAttribute = "productIDPriceQuantity";
    let nestedAttribute = query.replace(/productIDPriceQuantity/gi, '').toLowerCase()
    const minOrMaxPrepend = nestedAttribute.slice(0, 3).toLowerCase();
    const possibleQuantitativeQuery = nestedAttribute.slice(3);

    const fixedCasing = { "productid": "productID", "price": "price", "quantity": "quantity" };
    let validQueries = ['productid', 'minprice', 'maxprice', 'minquantity', 'maxquantity'];

    if (!validQueries.includes(nestedAttribute)) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    if (minOrMaxPrepend === "max" || minOrMaxPrepend === "min")
        nestedAttribute = fixedCasing[possibleQuantitativeQuery];
    else
        nestedAttribute = fixedCasing[nestedAttribute];


    if (!filters.hasOwnProperty(outsideAttribute)) { // To avoid overwriting existing key.
        filters[outsideAttribute] = {};
        filters[outsideAttribute]["$elemMatch"] = {};
    }
    if (!filters[outsideAttribute]["$elemMatch"].hasOwnProperty(nestedAttribute)) {
        filters[outsideAttribute]["$elemMatch"][nestedAttribute] = {}
    }
    if (minOrMaxPrepend === "max") {
        filters[outsideAttribute]["$elemMatch"][nestedAttribute]["$lte"] = parseInt(reqQuery[query]);
    }
    else if (minOrMaxPrepend === "min") {
        filters[outsideAttribute]["$elemMatch"][nestedAttribute]["$gte"] = parseInt(reqQuery[query]);
    }
    else {
        filters[outsideAttribute]["$elemMatch"][nestedAttribute] = reqQuery[query];
    }
    console.log(filters)
    return filters
}
function processQuery(filters, reqQuery, query) {
    //make everything lowercase first
    const minOrMaxPrepend = query.slice(0, 3).toLowerCase();
    let attribute = query.toLowerCase()
    const possibleQuantitativeQuery = attribute.slice(3);
    // We can list out all the fields, store the correct casing that our database recognises
    const fixedCasing = {
        "totalpriceaftergst": "totalPriceAfterGST", "totalpricebeforegst": "totalPriceBeforeGST", "dateofpurchase": "dateOfPurchase",
        "paymenttype": "paymentType", "paid": "paid", "supplier": "supplier", "invoiceid": "invoiceID"
    };
    let validQueries = ['mintotalpriceaftergst', 'maxtotalpriceaftergst', 'mintotalpricebeforegst', 'maxtotalpricebeforegst', 'mindateofpurchase', 'maxdateofpurchase',
        'paid', 'paymenttype', 'supplier', 'invoiceid'];

    if (!validQueries.includes(query.toLowerCase())) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    if (minOrMaxPrepend === "max" || minOrMaxPrepend === "min") //this means query is for a quantitative field
        attribute = fixedCasing[possibleQuantitativeQuery];
    else  // otherwise query is for a string field
        attribute = fixedCasing[attribute];
    console.log('attribute', attribute);
    console.log('minormaxprepend', minOrMaxPrepend);
    if (!filters.hasOwnProperty(attribute)) { // To avoid overwriting existing key.
        filters[attribute] = {};
    }
    if (minOrMaxPrepend.toLowerCase() == "max") {
        filters[attribute]["$lte"] = reqQuery[query] * 1;
    }
    else if (minOrMaxPrepend.toLowerCase() == "min") {
        filters[attribute]["$gte"] = reqQuery[query] * 1;
    }

    else if (attribute === "supplier" || attribute === "paymentType" || attribute === "paid") {
        filters[attribute] = reqQuery[query];
    }
    else {
        const regexQuery = new RegExp(reqQuery[query], 'i');
        filters[attribute] = regexQuery;

    }
    return filters;
}
function getFilter(reqQuery) {
    // Here we need to unpack the filters / queries - first step is to determine if there are even any filters / queries.

    var filters = {}; // We are going to add to the filters based on what the request query consists of
    try {
        for (const query in reqQuery) { // query is the key; reqQuery[query] is the value; key-value pair is (query, reqQuery[query])
            // If such queries exist, it would have min or max prepended to the string. So we need to take out the first 3 prepended characters.
            /**========================================================================
            *This part is required since productIDPriceQuantity is embedded in invoice.js
            https://studio3t.com/academy/lessons/query-embedded-documents-in-mongodb-arrays/
            *========================================================================**/
            if ((query.toLowerCase()).includes("productIDPriceQuantity".toLowerCase())) {
                filters = processNestedQuery(filters, reqQuery, query)
            }
            else {
                filters = processQuery(filters, reqQuery, query);
            }

        }
    } catch (err) {
        throw err;
    }
    return filters

}
module.exports = getFilter;