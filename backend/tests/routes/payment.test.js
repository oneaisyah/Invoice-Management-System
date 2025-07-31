//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
let createResource = require('./utils/Resource').createResource;

let PaymentModel = require('./../../models/payment');
let PaymentTypeModel = require('./../../models/paymentType');
let paymentData = require('../data/payment.input');
let paymentTypeData = require('../data/paymentType.input');
let Payment = createResource(paymentData, 'payment', 'payment', PaymentModel);
let PaymentType = createResource(paymentTypeData, 'payment-type', 'paymentType', PaymentTypeModel);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');

function PaymentTest() {
    //Our parent block



            
    describe('Payment', () => {

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
            const {username, password, roleLevel} = firstData;
            userAuthentication = createAuthentication(username, password, roleLevel);
            loginResponse = await userAuthentication.attemptLogin();
            userAuthentication.setToken(`Bearer ${loginResponse.body.token}`);
    
            User.Authentication = userAuthentication; //* Attaches the authentication (token details) to our User object; to fill().
            //! Please attach userAuthentication to each of the class's authentication! Example:
            // Payment.Authentication = userAuthentication

            await PaymentType.clear(); 
            await Payment.clear();

            PaymentType.Authentication = userAuthentication;
            await PaymentType.fill(); 
            Payment.Authentication = userAuthentication;
    
        });
        afterEach(async () => {
            await User.clear();
            await Payment.clear();
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
        /*
          * GET /payment success
          */
        describe('/GET payment', () => {
            it('should GET all documents', async () => {
                try {      
                    await Payment.fill();           
                    for (let i = 0; i < Payment.data.length; i++) {
                        Payment.data[i].type = PaymentType.data[0]._id;
                    }
                    let getRes = await Payment.getAll()
                    getRes.should.have.status(200);
                    getRes.body.payments.should.be.a('array');
                    getRes.body.payments.length.should.be.eql(9);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * POST /payment success
          */
        describe('/POST payment', () => {
            it('should post one document', async () => {
                try {
                    let postRes = await Payment.post(Payment.data[0]);


                    postRes.should.have.status(201);
                    postRes.body.payment.should.be.a('object');
                    postRes.body.payment.should.have.property('_id');
                    id = postRes.body.payment._id;
                    //post a new payment type and retrieve its _id property
                    let getRes = await Payment.getById(id);

                    getRes.should.have.status(200);
                    getRes.body.should.be.a('object');
                    getRes.body.payment.amount.should.eql(Payment.data[0].amount);
                    getRes.body.payment.type.should.eql(Payment.data[0].type);
                    getRes.body.payment.referenceNumber.should.eql(Payment.data[0].referenceNumber);
                    getRes.body.payment.recipientName.should.eql(Payment.data[0].recipientName);
                } catch (err) {
                    throw err;
                }
            })
        });
        /*
          * PUT /payment/:id success
          */
        describe('/PUT payment', () => {
            it('should update a posted document', async () => {
                try {
                    
                    let postRes = await Payment.post(Payment.data[0]);
                    id = postRes.body.payment._id;

                    updatedData = {
                        amount: 1000000,
                        referenceNumber: "1000",
                        recipientName: "PUTUPDATE"
                    }

                    let putRes = await Payment.put(id, updatedData)
                    putRes.should.have.status(201);

                    let getRes = await Payment.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.payment.should.be.a('object');
                    getRes.body.payment.amount.should.eql(1000000);
                    getRes.body.payment.referenceNumber.should.eql("1000");
                    getRes.body.payment.recipientName.should.eql("PUTUPDATE");
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * DELETE /payment/:id success
          */
        describe('/DELETE payment', () => {
            let id;
            before(async () => {
                try {
                    let postRes = await Payment.post(Payment.data[0]);
                    id = postRes.body.payment._id;
                } catch (err) {
                    throw err;
                }
            });
            it('should delete a posted document', async () => {
                try {
                    //post a new payment type and retrieve its _id property
                    let deleteRes = await Payment.delete(id)
                    deleteRes.should.have.status(200);
                    let getRes = await Payment.getById(id)
                    getRes.should.have.status(404);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /payment/?referenceNumber=12 success
        */
        describe('/GET payment | filter | referenceNumber ', () => {
            it('should retrieve only payments with reference number equal to "12"', async () => {
                try {
                    try {

                        await Payment.fill();
                    } catch (err) {
                        throw err;
                    }
                    
                    let filter = {};
                    filter.referenceNumber = "12";

                    let getRes = await Payment.getByFilter(filter)
                    getRes.should.have.status(200);
                    getRes.body.payments.should.be.a('array');
                    getRes.body.payments.length.should.eql(1);
                    getRes.body.payments[0].referenceNumber.should.eql("12");
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /payment/?minAmount=5499&maxAmount=6001 success
        */
        describe('/GET payment | filter | amount', () => {
            it('should retrieve only payments with amount between 5500 and 6000', async () => {
                try {
                    
                    try {
                        await Payment.fill();
                    } catch (err) {
                        throw err;
                    }

                    let filter = {};
                    filter.minAmount = 5499;
                    filter.maxAmount = 6001;

                    //post a new payment type and retrieve its _id property
                    let getRes = await Payment.getByFilter(filter)
                    getRes.should.have.status(200);
                    getRes.body.payments.should.be.a('array');
                    getRes.body.payments.length.should.eql(2);
                    for (let i = 0; i < 2; i++) {
                        getRes.body.payments[i].amount.should.be.below(6001);
                        getRes.body.payments[i].amount.should.be.above(5499);
                    }
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            try {
                await Payment.clear();
                await PaymentType.clear();
            } catch (err) {
                throw err;
            }
        })
    });
}
module.exports = PaymentTest;