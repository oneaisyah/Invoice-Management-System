const statementOfAccountData = [{

    referenceNumber: "000000000001",
    invoices: [null, null, null],
    payments: [null, null, null],
    dateIssued: new Date(2023, 4, 1),
    dateDue: new Date(2023, 5, 1),
    supplier: null,
    amountOutstanding: 500,
    amountPaid: 0,
    amountOverdue: 0,
    imageLink: "https://google.com/storage/"

}, {
    referenceNumber: "000000000002",
    invoices: [null, null, null],
    payments: [null, null, null],
    dateIssued: new Date(2023, 5, 1),
    dateDue: new Date(2023, 6, 1),
    supplier: null,
    amountOutstanding: 4000,
    amountPaid: 30,
    amountOverdue: 500,
    imageLink: "https://google.com/storage/"
}, {
    referenceNumber: "000000000003",
    invoices: [null, null, null],
    payments: [null, null, null],
    dateIssued: new Date(2023, 5, 1),
    dateDue: new Date(2023, 6, 1),
    supplier: null,
    amountOutstanding: 4000,
    amountPaid: 30,
    amountOverdue: 600,
    imageLink: "https://google.com/storage/"
}];

module.exports = { statementOfAccountData }