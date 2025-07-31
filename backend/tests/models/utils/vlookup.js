function performLookup(sourceData, lookupData, sourceField, lookupField, resultField) {
    const lookupMap = new Map();
    
    for (const item of lookupData) {
        lookupMap.set(item[lookupField], item[resultField]);
    }

    // Perform the lookup operation on the sourceData
    const result = sourceData.map((entry) => {
        const sourceValue = entry[sourceField];
        const resultValue = lookupMap.get(sourceValue);

        if (resultValue !== undefined) {
            return { ...entry, [resultField]: resultValue };
        }

        return { ...entry, [resultField]: "" };; //* No corresponding match; return empty string
    });

    return result;
}

// Example usage:
const dataA = [
    { keyA: "value1" },
    { keyA: "value2" },
    { keyA: "value3" }
];

const dataB = [
    { keyB: "value1", result: "outcome1" },
    { keyB: "value3", result: "outcome3" }
];

const result = performLookup(dataA, dataB, 'keyA', 'keyB', 'result'); 

console.log("🚀 ~ file: vlookup.js:37 ~ result:", result);


// Note that "keyA" should equal "keyB"
// Note that theoretically, you must know the key name in dataB; result.

const result2 = performLookup(dataA, dataB, 'keyA', 'keyB', 'reesult'); 

console.log("🚀 ~ file: vlookup.js:42 ~ result2:", result2);

module.exports = { performLookup } 