function extractFiltersFromReqQuery(requestQueries) {
    const quantitativeFields = ["productIDPriceQuantity", "GST", "totalPriceBeforeGST", "totalPriceAfterGST"];
    const filters = {};
    for (const query in requestQueries) { // query is the key; req.query[query] is the value; key-value pair is (query, req.query[query])
        // If such queries exist, it would have min or max prepended to the string. So we need to take out the first 3 prepended characters.

        const minOrMaxPrepend = query.slice(0, 3);
        let possibleQuantitativeQuery = query.slice(3);

        /**========================================================================
        *This part is required since productIDPriceQuantity is embedded in invoice.js
        https://studio3t.com/academy/lessons/query-embedded-documents-in-mongodb-arrays/
        *========================================================================**/
        if ((possibleQuantitativeQuery.toLowerCase()).includes("productIDPriceQuantity".toLowerCase())) {
            const attributeOfProductIDPriceQuantity = possibleQuantitativeQuery.replace(/productIDPriceQuantity/gi, '').toLowerCase();

            possibleQuantitativeQuery = "productIDPriceQuantity";
            if (!filters.hasOwnProperty(possibleQuantitativeQuery)) { // To avoid overwriting existing key.
                filters[possibleQuantitativeQuery] = {};
                filters[possibleQuantitativeQuery]["$elemMatch"] = {};
            }
            if (!filters[possibleQuantitativeQuery]["$elemMatch"].hasOwnProperty(attributeOfProductIDPriceQuantity)) {
                filters[possibleQuantitativeQuery]["$elemMatch"][attributeOfProductIDPriceQuantity] = {}
            }
            if (minOrMaxPrepend.toLowerCase() == "max") {
                filters[possibleQuantitativeQuery]["$elemMatch"][attributeOfProductIDPriceQuantity]["$lte"] = parseInt(requestQueries[query]);
            }

            if (minOrMaxPrepend.toLowerCase() == "min") {
                filters[possibleQuantitativeQuery]["$elemMatch"][attributeOfProductIDPriceQuantity]["$gte"] = parseInt(requestQueries[query]);
            }

        }
        else if (quantitativeFields.map(word => word.toLowerCase()).includes(possibleQuantitativeQuery.toLowerCase())) {
            if (!filters.hasOwnProperty(possibleQuantitativeQuery)) { // To avoid overwriting existing key.
                filters[possibleQuantitativeQuery] = {};
            }
            console.log(possibleQuantitativeQuery);
            if (minOrMaxPrepend.toLowerCase() == "max") {
                filters[possibleQuantitativeQuery]["$lte"] = parseInt(requestQueries[query]);
            }

            if (minOrMaxPrepend.toLowerCase() == "min") {
                filters[possibleQuantitativeQuery]["$gte"] = parseInt(requestQueries[query]);
            }
        }
        else { // Not a quantitative field, filter as per string.
            filters[query] = requestQueries[query];
        }
    }
    return filters;
}

module.exports = {
    extractFiltersFromReqQuery
};