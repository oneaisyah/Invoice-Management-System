function processQuery(filters, reqQuery, query) {
    //make everything lowercase first
    const minOrMaxPrepend = query.slice(0, 3).toLowerCase();
    let attribute = query.toLowerCase()
    // We can list out all the fields, store the correct casing that our database recognises
    const fixedCasing = {
        'name': 'name', "upc": "upc"
    };
    let validQueries = ["name", "upc"];
    if (!validQueries.includes(query.toLowerCase())) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    attribute = fixedCasing[attribute];
    if (!validQueries.includes(query.toLowerCase())) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    if (!filters.hasOwnProperty(attribute)) { // To avoid overwriting existing key.
        filters[attribute] = {};
    }

    const regexQuery = new RegExp(reqQuery[query], 'i');
    filters[attribute] = regexQuery;
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