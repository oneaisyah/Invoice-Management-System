function processQuery(filters, reqQuery, query) {
    //make everything lowercase first
    const minOrMaxPrepend = query.slice(0, 3).toLowerCase();
    let attribute = query.toLowerCase()
    const possibleQuantitativeQuery = attribute.slice(3);
    // We can list out all the fields, store the correct casing that our database recognises
    const fixedCasing = {
        'referencenumber': 'referenceNumber', "datedue": "dateDue", "supplier": "supplier", "invoices": "invoices", "payments": "payments",
        "amountoutstanding": "amountOutstanding", "amountpaid": "amountPaid", "amountoverdue": "amountOverdue"
    };
    let validQueries = ['referencenumber', 'supplier', "invoices", "payments", 'mindatedue', 'maxdatedue', 'minamountoutstanding', 'maxamountoutstanding',
        'minamountoverdue', 'maxamountoverdue', 'minamountpaid', 'maxamountpaid'];

    if (!validQueries.includes(query.toLowerCase())) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    if (minOrMaxPrepend === "max" || minOrMaxPrepend === "min") //this means query is for a quantitative field
        attribute = fixedCasing[possibleQuantitativeQuery];
    else  // otherwise query is for a string field
        attribute = fixedCasing[attribute];

    if (!filters.hasOwnProperty(attribute)) { // To avoid overwriting existing key.
        filters[attribute] = {};
    }
    if (minOrMaxPrepend.toLowerCase() == "max") {
        filters[attribute]["$lte"] = parseInt(reqQuery[query]);
    }
    else if (minOrMaxPrepend.toLowerCase() == "min") {
        filters[attribute]["$gte"] = parseInt(reqQuery[query]);
    }
    else if (attribute === "invoices" || attribute === "payments") {
        filters[attribute]["$elemMatch"] = {};
        filters[attribute]["$elemMatch"]["$eq"] = reqQuery[query];
    }
    else if (attribute === "supplier") {
        filters[attribute] = reqQuery[query];

    }
    else {
        const regexQuery = new RegExp(reqQuery[query], 'i');
        filters[attribute] = regexQuery;

    }
    return filters;
}
function getFilter(reqQuery) {
    let filters = {}; // We are going to add to the filters based on what the request query consists of
    try {
        for (const query in reqQuery) { // query is the key; reqQuery[query] is the value; key-value pair is (query, reqQuery[query])
            filters = processQuery(filters, reqQuery, query);
        }
    } catch (err) { //FilterError has occurred
        throw err;
    }
    return filters;
}
module.exports = getFilter;