//During the tests the NODE_ENV variable is set to 'test'
process.env.NODE_ENV = 'test';
const authenticationRouteTest = require('./routes/authentication.test');
const userRouteTest = require('./routes/user.test');
const paymentRouteTest = require('./routes/payment.test');
const paymentTypeRouteTest = require('./routes/paymentType.test');
const productRouteTest = require('./routes/product.test');
const supplierRouteTest = require('./routes/supplier.test');
const invoiceRouteTest = require('./routes/invoice.test');
const statementOfAccountRouteTest = require('./routes/statementOfAccount.test');
const invoiceCSVRouteTest = require('./routes/invoice.csv.test');
const StatementOfAccountRouteCSVTest = require('./routes/statementOfAccount.csv.test');


authenticationRouteTest();
userRouteTest();
paymentTypeRouteTest();
paymentRouteTest();
productRouteTest();
supplierRouteTest();
invoiceRouteTest();

statementOfAccountRouteTest();

invoiceCSVRouteTest();
StatementOfAccountRouteCSVTest();
