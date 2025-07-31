function processQuery(filters, reqQuery, query) {
    //make everything lowercase first
    let attribute = query.toLowerCase()
    // We can list out all the fields, store the correct casing that our database recognises
    const fixedCasing = {
        'name': 'name', "address": "address"
    };
    let validQueries = ["name", "address"];
    if (!validQueries.includes(query.toLowerCase())) {
        const err = new Error(`'${query}' is not a valid query`);
        err.name = "FilterError";
        throw err;
    }
    attribute = fixedCasing[attribute];
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
            console.log('query', query)
            filters = processQuery(filters, reqQuery, query);
        }
    } catch (err) { //FilterError has occurred
        throw err;
    }
    console.log("filters in getFilter", filters);
    return filters;
}
module.exports = getFilter;