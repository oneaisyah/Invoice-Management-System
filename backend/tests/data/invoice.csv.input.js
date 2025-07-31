var invoicesToPost = [{
    productIDPriceQuantity: [
        {
            productID: null,
            price: 400,
            quantity: 50,
        }, {
            productID: null,
            price: 800,
            quantity: 40
        }, {
            productID: null,
            price: 400,
            quantity: 10
        }
    ],
    invoiceID: "INV-2023-04/ABC/01",
    supplier: null,
    paymentType: null,
    dateOfPurchase: new Date(2023, 4, 3),
    paid: false,
    totalPriceBeforeGST: 56000,
    totalPriceAfterGST: 60480,
    imageLink: 'https://google.com/storage'
}, {
    productIDPriceQuantity: [
        {
            productID: null,
            price: 600,
            quantity: 100
        }
    ],
    invoiceID: "INV-2023-04/ABC/02",
    supplier: null,
    paymentType: null,
    dateOfPurchase: new Date(2023, 4, 3),
    paid: true,
    totalPriceBeforeGST: 60000,
    totalPriceAfterGST: 64800,
    imageLink: 'https://google.com/storage'
}];
module.exports = { invoicesToPost };