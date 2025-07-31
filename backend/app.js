//initialise express
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const logger = require('morgan');

//configure env file
const path = require('path');
const dotenv = require('dotenv');
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

//configure mongoose
const mongoose = require("mongoose");
const dbName = process.env.NODE_ENV == "test" ? process.env.dbName_testing : process.env.dbName_production;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: dbName,
};
//connect to mongodb instance
mongoose.connect(process.env.mongodb_uri, options);
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Connection to MongoDB database is successful.");
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var listener = app.listen(8888, () => {
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
    console.log('Type this in browser (baseURL): http://localhost:8888/')
});
const paymentRouter = require('./routes/payment');
const paymentTypeRouter = require('./routes/paymentType');
const invoiceRouter = require('./routes/invoice');
const statementOfAccountRouter = require('./routes/statementOfAccount');
const supplierRouter = require("./routes/supplier");
const productRouter = require("./routes/product");
const authenticateRouter = require("./routes/authenticate");
const userRouter = require("./routes/user");
app.use('/payment', paymentRouter);
app.use('/payment-type', paymentTypeRouter);
app.use('/invoice', invoiceRouter);
app.use('/statement-of-account', statementOfAccountRouter);
app.use('/product', productRouter);
app.use('/supplier', supplierRouter);
app.use('/authenticate', authenticateRouter);
app.use('/user', userRouter);
module.exports = app;