
// convertToJSON is a function that takes in image of invoice and converts it to JSON format
const convertToJSON = (data) => {
    const invoice = data;
    console.log(data);
    // For each prperty in invoice, check if it exists
    // If it exists, store it in a variable
    // If it does not exist, store null in a variable
    let invoiceID;
    if (invoice.invoice_id) {
        invoiceID = invoice.invoice_id.mention_text;
    };
    let supplier;
    if (invoice.supplier_name) {
        supplier = invoice.supplier_name.mention_text;
    };
    let dateOfPurchase;
    if (invoice.invoice_date) {
        let [day, month, year] = invoice.invoice_date.mention_text.split("/");
        // Rearrange the components into ISO format YYYY-MM-DD
        let isoDate = `${year}-${month}-${day}`;
        dateOfPurchase = isoDate;
    };
    let paymentType;
    if (invoice.paymentType) {
        paymentType = invoice.paymentType;
    };
    let paid;
    if (invoice.paid) {
        paid = invoice.paid;
    };
    let GST;
    if (invoice.GST) {
        GST = invoice.GST;
    };
    let totalPriceBeforeGST;
    if (invoice.net_amount) {
        totalPriceBeforeGST = invoice.net_amount.mention_text;
    };
    let totalPriceAfterGST;
    if (invoice.total_amount) {
        totalPriceAfterGST = invoice.total_amount.mention_text;
    }
    else if (invoice.net_amount && invoice.total_tax_amount) {
        totalPriceAfterGST = parseFloat(invoice.net_amount.mention_text) + parseFloat(invoice.total_tax_amount.mention_text);
    }
    let currency;
    if (invoice.currency) {
        currency = invoice.currency;
    };

    // productIDPriceQuantity is an array of objects
    // Each object contains the productID, price, and quantity of the product
    // In data, products are stored as an array of objects where each product is line_item[i]
    // Each line_item[i] contains the productID, price, and quantity of the product
    const productIDPriceQuantity = [];
    let index = 0;
    Object.keys(data).forEach(key => {
        if (key.includes('line_item')) {
            const lineItem = data[key];
            let productID;
            let price;
            let quantity;
            for (let i = 0; i < Object.keys(lineItem).length; i++) {
                key = Object.keys(lineItem)[i];
                if (key.includes('description')) {
                    const productIDKey = `line_item/description${index}`;
                    productID = lineItem[productIDKey].mention_text;
                }
                if (key.includes('unit_price')) {
                    const priceKey = `line_item/unit_price${index}`;
                    price = lineItem[priceKey].mention_text;
                }
                if (key.includes('quantity')) {
                    const quantityKey = `line_item/quantity${index}`;
                    quantity = lineItem[quantityKey].mention_text;
                }
            }
            // forEach(lineItem, (value, key) => {
            //     if (key.includes('description')) {
            //         const productIDKey = `line_item/description${index}`;
            //         productID = lineItem[productIDKey].mention_text;
            //     }
            //     if (key.includes('unit_price')) {
            //         const priceKey = `line_item/unit_price${index}`;
            //         price = lineItem[priceKey].mention_text;
            //     }
            //     if (key.includes('quantity')) {
            //         const quantityKey = `line_item/quantity${index}`;
            //         quantity = lineItem[quantityKey].mention_text;
            //     }
            // });
            // If productID, price, or quantity exists, store it in productIDPriceQuantity
            // Else, no new row will be added to the table
            if (productID || price || quantity) {
                productIDPriceQuantity[index] = { productID, price, quantity };
            }
            index += 1;
        }
    });

    return { invoiceID, supplier, dateOfPurchase, paymentType, paid, GST, totalPriceBeforeGST, totalPriceAfterGST, currency, productIDPriceQuantity }
}

module.exports = convertToJSON;