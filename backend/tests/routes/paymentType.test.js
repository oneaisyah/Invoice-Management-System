//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
let createResource = require('./utils/Resource').createResource;

let PaymentTypeModel = require('./../../models/paymentType');
let paymentTypeData = require('../data/paymentType.input');
let PaymentType = createResource(paymentTypeData, 'payment-type', 'paymentType', PaymentTypeModel);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');

function paymentTypeTest() {
    //Our parent block
    describe('PaymentType', () => {

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
            PaymentType.Authentication = userAuthentication

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


        //Before each test, delete all entities in Test_Database
        beforeEach(async () => {
            try {
                await PaymentType.clear();
            } catch (err) {
                throw err;
            }
        });
        /*
          * GET /payment-type success
          */
        describe('/GET payment-type', () => {
            it('should GET all documents', async () => {
                try {
                    let getRes = await PaymentType.getAll();
                    getRes.should.have.status(200);
                    getRes.body.paymentTypes.should.be.a('array');
                    getRes.body.paymentTypes.length.should.be.eql(0);
                } catch (err) {
                    console.log(err);
                    throw err;
                }
            });
        });
        /*
          * POST /payment-type success
          */
        describe('/POST payment-type', () => {
            beforeEach(async () => {
                try {
                    await PaymentType.clear();
                } catch (err) {
                    throw err;
                }
            });
            it('should post one document', async () => {
                try {
                    let postRes = await PaymentType.post(PaymentType.data[0]);
                    id = postRes.body.paymentType._id;

                    let getRes = await PaymentType.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.paymentType.should.be.a('object');
                    getRes.body.paymentType.should.have.property('name');
                    getRes.body.paymentType.name.should.eql('paylah');
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * PUT /payment-type/:id success
          */
        describe('/PUT payment-type', () => {
            let id;
            let oldName;
            beforeEach(async () => {
                try {
                    await PaymentType.clear();
                    postRes = await PaymentType.post(PaymentType.data[0])
                    id = postRes.body.paymentType._id;

                    oldName = PaymentType.data[0].name;
                    PaymentType.data[0].name = "paynow";
                } catch (err) {
                    throw err;
                }
            });
            it('should update a posted document', async () => {
                try {
                    let putRes = await PaymentType.put(id, PaymentType.data[0]);
                    putRes.should.have.status(201);
                    putRes.body.paymentType.should.be.a('object');
                    putRes.body.paymentType.should.have.property('name');
                    putRes.body.paymentType.name.should.eql(PaymentType.data[0].name);

                    let getRes = await PaymentType.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.paymentType.should.be.a('object');
                    getRes.body.paymentType.name.should.eql(PaymentType.data[0].name);
                } catch (err) {
                    throw err;
                }
                after(() => {
                    PaymentType.data[0].name = oldName;
                });
            });
        });
        /*
          * DELETE /payment-type/:id success
          */
        describe('/DELETE payment-type', () => {
            let id;
            beforeEach(async () => {
                try {
                    await PaymentType.clear();
                    let postRes = await PaymentType.post(PaymentType.data[0]);
                    id = postRes.body.paymentType._id;
                } catch (err) {
                    throw err;
                }
            });
            it('should delete a posted document', async () => {
                try {
                    const deleteRes = await PaymentType.delete(id)
                    deleteRes.should.have.status(200);
                    const getRes = await PaymentType.getById(id);
                    getRes.should.have.status(404);
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            try {
                await PaymentType.clear();
            } catch (err) {
                throw err;
            }
        })
    });
}
module.exports = paymentTypeTest;