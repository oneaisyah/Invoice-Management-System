
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
const { invoiceData } = require('../data/invoice.input');
const createInvoice = require('./utils/Invoice');
const mongoose = require('mongoose');
const Invoice = createInvoice(invoiceData);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user', 'user', UserModel);

const createAuthentication = require('./utils/Authentication');

function InvoiceTest() {
    //Our parent block
    describe('Invoice', () => {

        /**-----------------------------------------------------------------------------------------------------------------------
         *! Include this at the top of every test suite requiring token authentication
            *-----------------------------------------------------------------------------------------------------------------------**/
        /*! Import lines; for your convenience
    
            let UserModel = require('./../../models/user');
            let userData = require('../data/user.input');
    
            const createUser = require('./utils/User');
            let User = createUser(userData, 'user','user', UserModel);
    
            const createAuthentication = require('./utils/Authentication');
        */
        before(async () => {
            await User.clear(); //* Clears the user database
            const firstData = User.data[0];
            await User.firstPost(firstData);
            const { username, password, roleLevel } = firstData;
            userAuthentication = createAuthentication(username, password, roleLevel);
            loginResponse = await userAuthentication.attemptLogin();
            userAuthentication.setToken(`Bearer ${loginResponse.body.token}`);

            User.Authentication = userAuthentication; //* Attaches the authentication (token details) to our User object; to fill().
            //! Please attach userAuthentication to each of the class's authentication! Example:
            // Payment.Authentication = userAuthentication
            Invoice.Authentication = userAuthentication;

            await User.fill();

        });
        afterEach(async () => {
            await User.clear();
        });

        /*
            !Note that for your loops in individual tests: you cannot use foreach; you have to loop as the following:
            for (let i = 0; i < User.data.length; i++) { 
                user = User.data[i]
                const {username, password, roleLevel} = user;
        */

        /**-----------------------------------------------------------------------------------------------------------------------
         *! Include this at the top of every test suite requiring token authentication
            *-----------------------------------------------------------------------------------------------------------------------**/
        describe('/GET invoice', () => {

            it('should GET all documents', async () => {
                try {
                    try {
                        await Invoice.initialise();
                    }
                    catch (err) {
                        throw err;
                    }
                    let res = await Invoice.getAll();
                    res.should.have.status(200);
                    res.body.invoices.should.be.a('array');
                    res.body.invoices.length.should.be.eql(0);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        describe('/GET invoice/:id', () => {
            it('should return 404 not found error', async () => {
                try {
                    let res = await Invoice.getById(new mongoose.Types.ObjectId())
                    res.status.should.be.eql(404);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        describe('/POST invoice', () => {
            before(async () => {
                try {
                    await Invoice.clear();
                } catch (err) {
                    throw err;
                }
            });
            it('should post one document', async () => {
                let id;
                try {
                    let postRes = await Invoice.post(Invoice.data[0]);
                    postRes.should.have.status(201);
                    postRes.body.should.be.a('object');
                    postRes.body.invoice.should.have.property('_id');
                    id = postRes.body.invoice._id;

                    let getRes = await Invoice.getById(id);
                    console.log('getRes', getRes);
                    getRes.should.have.status(200);
                    getRes.body.should.be.a('object');
                    const invoiceRes = getRes.body.invoice;
                    for (let i = 0; i < invoiceRes.length; i++) {
                        let keys = Object.keys(invoiceRes[i]);
                        for (let j = 0; j < keys.length; j++)
                            invoiceRes[i][keys[j]].should.eql(Invoice.data[i][keys[j]]);
                    }
                    invoiceRes.supplier.should.eql(Invoice.data[0].supplier);
                    invoiceRes.invoiceID.should.eql(Invoice.data[0].invoiceID);
                    invoiceRes.paid.should.eql(Invoice.data[0].paid);
                    new Date(invoiceRes.dateOfPurchase).should.eql(Invoice.data[0].dateOfPurchase);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        /**
         * POST /invoice invalid dateOfPurchase
         */
        describe('/POST invoice | invalid | dateOfPurchase too large', () => {
            let oldDateOfPurchase;
            before(async () => {
                try {
                    await Invoice.clear();
                    oldDateOfPurchase = Invoice.data[0].dateOfPurchase;
                    var date = new Date();
                    // add a day
                    date.setDate(date.getDate() + 1);
                    Invoice.data[0].dateOfPurchase = date;
                }
                catch (err) {
                    throw err;
                }
            });
            it('should return ValidationError', async () => {
                try {
                    let res = await Invoice.post(Invoice.data[0])
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.error.name.should.eql("ValidationError");
                }
                catch (err) {
                    throw err;
                }
            });
            after(() => {
                Invoice.data[0].dateOfPurchase = oldDateOfPurchase;
            })
        });
        describe('/POST invoice | invalid | sum of item prices not equal to totalPriceAfterGST or totalPriceBeforeGST', () => {
            let oldTotalPriceBeforeGST;
            before(async () => {
                try {
                    await Invoice.clear();
                    oldTotalPriceBeforeGST = Invoice.data[0].totalPriceBeforeGST;
                    Invoice.data[0].totalPriceBeforeGST = oldTotalPriceBeforeGST + 0.1;
                }
                catch (err) {
                    throw err;
                }
            });
            it('should return ValidationError', async () => {
                try {
                    let res = await Invoice.post(Invoice.data[0])
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.error.name.should.eql("ValidationError");
                }
                catch (err) {
                    throw err;
                }
            });
            after(() => {
                Invoice.data[0].totalPriceBeforeGST = oldTotalPriceBeforeGST;
            })
        });
        describe('/POST invoice | invalid | totalPriceAfterGST less than totalPriceBeforeGST', () => {
            let oldTotalPriceAfterGST;
            before(async () => {
                try {
                    await Invoice.clear();
                    oldTotalPriceAfterGST = Invoice.data[0].totalPriceAfterGST;
                    Invoice.data[0].totalPriceAfterGST = Invoice.data[0].totalPriceBeforeGST - 0.1;
                }
                catch (err) {
                    throw err;
                }
            });
            it('should return ValidationError', async () => {
                try {
                    let res = await Invoice.post(Invoice.data[0])
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.error.name.should.eql("ValidationError");
                }
                catch (err) {
                    throw err;
                }
            });
            after(() => {
                Invoice.data[0].totalPriceAfterGST = oldTotalPriceAfterGST;
            })
        })
        /*
          * PUT /invoice/:id success
          */
        describe('/PUT invoice | Valid', () => {
            let id;
            before(async () => {
                try {
                    await Invoice.clear();
                    res = await Invoice.post(Invoice.data[0]);
                    id = res.body.invoice._id;
                }
                catch (err) {
                    throw err;
                };
            });
            it('should update a posted document', async () => {
                try {
                    //change one property of the invoice
                    Invoice.data[0].paid = true;
                    //update the invoice first
                    let putRes = await Invoice.put(id, Invoice.data[0])

                    //check whether updated invoice returned correctly
                    putRes.should.have.status(201);
                    putRes.body.invoice.should.be.a('object');
                    putRes.body.invoice.paid.should.eql(Invoice.data[0].paid);
                    id = putRes.body.invoice._id;
                    //retrieve the recently updated invoice to check if its stored correctly
                    let getRes = await Invoice.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.invoice.should.be.a('object');
                    getRes.body.invoice.paid.should.eql(Invoice.data[0].paid);
                    for (let i = 0; i < getRes.body.invoice.productIDPriceQuantity; i++) {
                        getRes.body.invoice.productIDPriceQuantity[i].should.eql(Invoice.data.productIDPriceQuantity[i]);
                    }
                    getRes.body.invoice.supplier.should.eql(Invoice.data[0].supplier);
                    getRes.body.invoice.invoiceID.should.eql(Invoice.data[0].invoiceID);
                    getRes.body.invoice.paid.should.eql(Invoice.data[0].paid);
                    new Date(getRes.body.invoice.dateOfPurchase).should.eql(Invoice.data[0].dateOfPurchase);
                    getRes.body.invoice.imageLink.should.eql(Invoice.data[0].imageLink);
                }
                catch (err) {
                    throw err;
                }
            });
            after(() => {
                //reset paid to false
                Invoice.data[0].paid = false;
            })
        });
        /*
          * DELETE /invoice/:id success
          */
        describe('/DELETE invoice | Valid', () => {
            let id;
            before(async () => {
                try {
                    await Invoice.clear();
                    let postRes = await Invoice.post(Invoice.data[0])
                    id = postRes.body.invoice._id;
                }
                catch (err) {
                    throw err;
                }
            });
            it('should delete a posted document', async () => {
                try {
                    let deleteRes = await Invoice.delete(id)
                    deleteRes.should.have.status(200);
                    deleteRes.body.invoice.should.be.a('object');
                    let getRes = await Invoice.getById(id);
                    getRes.should.have.status(404);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /invoice/?mintotalPriceBeforeGST=8000000&maxtotalPriceAfterGST=12000000 success
        */
        describe('/GET invoice | filter | quantitative field | matching filter', () => {
            let filter = {
                mintotalPriceAfterGST: 800,
                maxtotalPriceAfterGST: 1200
            }
            before(async () => {
                try {
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
            });
            it('should retrieve only invoices with totalPriceAfterGST greater than or equal to 800 and less than or equal to 1200', async () => {
                //post a new payment type and retrieve its _id property
                try {

                    let getRes = await Invoice.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.invoices.should.be.a('array');
                    // getRes.body.invoices.length.should.eql(2);
                    for (let i = 0; i < 2; i++) {
                        //Convert string to Number
                        getRes.body.invoices[i].totalPriceBeforeGST *= 1;
                        getRes.body.invoices[i].totalPriceAfterGST *= 1;
                        //Check whether number matches filter
                        getRes.body.invoices[i].totalPriceBeforeGST.should.be.above(799);
                        getRes.body.invoices[i].totalPriceAfterGST.should.be.below(1201);
                    }
                }
                catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /invoice/?mintotalPriceBeforeGST=8000000&maxtotalPriceAfterGST=12000000 success
        */

        describe('/GET invoice | filter | quantitative field | invalid', () => {
            let filter;
            before(async () => {
                try {
                    filter = {
                        mintotalPriceAfterGST: 8000000,
                        maxtotalPriceAfterGST: 3000000,
                    };
                    await Invoice.fill();
                } catch (err) {
                    throw err;
                }
            })
            it('should retrieve no invoices because filter invalid', async () => {
                //post a new payment type and retrieve its _id property
                try {
                    let getRes = await Invoice.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.invoices.should.be.a('array');
                    getRes.body.invoices.length.should.eql(0);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        describe('/GET invoice | filter | string field | valid', () => {
            let filter;
            before(async () => {
                try {
                    filter = {
                        supplier: Invoice.data[0].supplier
                    };
                    await Invoice.fill();
                } catch (err) {
                    throw err;
                }
            });
            it('should retrieve invoice with correct supplier', async () => {
                try {
                    //post a new payment type and retrieve its _id property
                    let getRes = await Invoice.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.invoices.should.be.a('array');
                    getRes.body.invoices.length.should.eql(3);
                    for (let i = 0; i < getRes.body.invoices.length; i++)
                        getRes.body.invoices[i].supplier.should.eql(filter.supplier);
                } catch (err) {
                    throw err;
                }
            });
        });
        describe('/GET invoice | filter | string field | productID | valid', async () => {
            let filter;
            before(async () => {
                try {
                    filter = {
                        productIDPriceQuantityProductID: Invoice.data[0].productIDPriceQuantity[2].productID
                    };
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
            });
            it('should retrieve all invoices that contain productID matching filter', async () => {
                try {
                    //post a new payment type and retrieve its _id property
                    let getRes = await Invoice.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.invoices.should.be.a('array');
                    getRes.body.invoices.length.should.eql(1);
                    //only one invoice, so we take the first element, and check that the second item in the productIDPriceQuantity array is equal to the filter
                    getRes.body.invoices[0].productIDPriceQuantity[2].productID.should.eql(filter.productIDPriceQuantityProductID);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        describe('/GET invoice | filter | quantitative field | price | valid', async () => {
            let filter;
            before(async () => {
                try {
                    filter = {
                        productIDPriceQuantityMinPrice: 60000,
                        productIDPriceQuantityMaxPrice: 80000
                    };
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
            });
            it('should retrieve some invoices that contain items with the price matching the filter', async () => {
                try {
                    let getRes = await Invoice.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.invoices.should.be.a('array');
                    getRes.body.invoices.length.should.eql(2);
                }
                catch (err) {
                    throw err;
                }
            });
        });
        describe('/GET invoice | filter | invalid ', async () => {
            let filter;
            before(async () => {
                try {
                    filter = {
                        invalidField: 'invalidValue'
                    };
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
            });
            it('should throw a filterError due to invalid field in filter', async () => {
                try {
                    let getRes = await Invoice.getByFilter(filter)

                    getRes.should.have.status(400);
                    getRes.body.should.have.property('error');
                    getRes.body.error.name.should.eql('FilterError');
                } catch (err) {
                    throw err;
                };
            });
        });
        after(async () => {
            try {
                await Invoice.reset();
            } catch (err) {
                throw err;
            }
        });
    });

}

module.exports = InvoiceTest;