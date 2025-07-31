
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
const { statementOfAccountData } = require('../data/statementOfAccount.input');
const createStatementOfAccount = require('./utils/StatementOfAccount');
const StatementOfAccount = createStatementOfAccount(statementOfAccountData);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');

function StatementOfAccountTest() {
    //Our parent block
    describe('Statement Of Account', () => {

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
            StatementOfAccount.Authentication = userAuthentication;
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

        /*
          * GET /statement-of-account success
          */
        describe('/GET statement-of-account', () => {
            it('should GET all documents', async () => {
                try {
                    try {
                        await StatementOfAccount.initialise();
                        await StatementOfAccount.clear();
                    } catch (err) {
                        throw err;
                    }
                    let getRes = await StatementOfAccount.getAll();

                    getRes.should.have.status(200);
                    getRes.body.statementOfAccounts.should.be.a('array');
                    getRes.body.statementOfAccounts.length.should.be.eql(0);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * POST /statement-of-account success
          */
        describe('/POST statement-of-account', () => {
            it('should post one document', async () => {
                try {
                    try {
                        await StatementOfAccount.clear();
                    }
                    catch (err) {
                        throw err;
                    }
                    let postRes = await StatementOfAccount.post(StatementOfAccount.data[0]);
                    postRes.should.have.status(201);
                    postRes.body.should.be.a('object');
                    postRes.body.statementOfAccount.should.have.property('_id');
                    let id = postRes.body.statementOfAccount._id;
                    let getRes = await StatementOfAccount.getById(id);
                    let statementOfAccount = getRes.body.statementOfAccount;
                    getRes.should.have.status(200);
                    getRes.body.should.be.a('object');
                    for (let i = 0; i < statementOfAccount.invoices.length; i++) {
                        statementOfAccount.invoices[i] = StatementOfAccount.data[0].invoices[i];
                    }
                    for (let i = 0; i < statementOfAccount.payments.length; i++) {
                        statementOfAccount.payments[i] = StatementOfAccount.data[0].payments[i];
                    }
                    statementOfAccount.supplier.should.eql(StatementOfAccount.data[0].supplier);
                    const dateIssued = new Date(statementOfAccount.dateIssued);
                    const dateDue = new Date(statementOfAccount.dateDue);
                    dateIssued.should.eql(StatementOfAccount.data[0].dateIssued);
                    dateDue.should.eql(StatementOfAccount.data[0].dateDue);
                    statementOfAccount.referenceNumber.should.eql(StatementOfAccount.data[0].referenceNumber);
                    statementOfAccount.amountPaid.should.eql(StatementOfAccount.data[0].amountPaid);
                    statementOfAccount.amountOutstanding.should.eql(StatementOfAccount.data[0].amountOutstanding); // Because cents
                    statementOfAccount.amountOverdue.should.eql(StatementOfAccount.data[0].amountOverdue);
                    statementOfAccount.imageLink.should.eql(StatementOfAccount.data[0].imageLink);
                } catch (err) {
                    throw err;
                }
            });
        });

        /*
          * PUT /statement-of-account/:id success
          */
        describe('/PUT statement-of-account | Valid', () => {
            it('should update a posted document', async () => {
                try {
                    let id;
                    try {
                        await StatementOfAccount.clear();
                        //post one StatementOfAccount to database
                        let postRes = await StatementOfAccount.post(StatementOfAccount.data[0]);
                        id = postRes.body.statementOfAccount._id;
                        StatementOfAccount.data[0]._id = id;
                        //update the local value of the StatementOfAccount
                        StatementOfAccount.data[0].amountOutstanding += 1000;
                    } catch (err) {
                        throw err;
                    }
                    //make a put request with the updated StatementOfAccount
                    let putRes = await StatementOfAccount.put(id, StatementOfAccount.data[0]);
                    putRes.should.have.status(201);
                    putRes.body.statementOfAccount.should.be.a('object');
                    // putRes.body.statementOfAccount.amountOutstanding.should.eql(StatementOfAccount.data[0].amountOutstanding);
                    //check that it was stored properly
                    let getRes = await StatementOfAccount.getById(id);
                    let statementOfAccount = getRes.body.statementOfAccount;
                    getRes.should.have.status(200);
                    getRes.body.should.be.a('object');
                    for (let i = 0; i < statementOfAccount.invoices.length; i++) {
                        statementOfAccount.invoices[i] = StatementOfAccount.data[0].invoices[i];
                    }
                    for (let i = 0; i < statementOfAccount.payments.length; i++) {
                        statementOfAccount.payments[i] = StatementOfAccount.data[0].payments[i];
                    }
                    statementOfAccount.supplier.should.eql(StatementOfAccount.data[0].supplier);

                    statementOfAccount.amountOutstanding = statementOfAccount.amountOutstanding*100
                    const dateIssued = new Date(statementOfAccount.dateIssued);
                    const dateDue = new Date(statementOfAccount.dateDue);
                    dateIssued.should.eql(StatementOfAccount.data[0].dateIssued);
                    dateDue.should.eql(StatementOfAccount.data[0].dateDue); statementOfAccount.referenceNumber.should.eql(StatementOfAccount.data[0].referenceNumber);
                    statementOfAccount.amountPaid.should.eql(StatementOfAccount.data[0].amountPaid);
                    statementOfAccount.amountOutstanding.should.eql(StatementOfAccount.data[0].amountOutstanding/100);
                    statementOfAccount.amountOverdue.should.eql(StatementOfAccount.data[0].amountOverdue);
                    statementOfAccount.imageLink.should.eql(StatementOfAccount.data[0].imageLink);

                } catch (err) {
                    throw err;
                }
            });
            after(async () => {
                try {
                    StatementOfAccount.data[0].amountOutstanding -= 1000;
                    await StatementOfAccount.clear();
                    await StatementOfAccount.fill();
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * DELETE /statement-of-account/:id  success
        */
        describe('/DELETE statement-of-account | Valid', () => {
            it('should delete a posted document', async () => {
                try {
                    let id;
                    try {
                        await StatementOfAccount.clear();
                        //post one StatementOfAccount to database
                        let postRes = await StatementOfAccount.post(StatementOfAccount.data[0]);
                        //store the id of the posted StatementOfAccount
                        id = postRes.body.statementOfAccount._id
                        StatementOfAccount.data[0]._id = id;
                    } catch (err) {
                        throw err;
                    }
                    //delete the posted statementOfAccount
                    let deleteRes = await StatementOfAccount.delete(id);
                    deleteRes.should.have.status(200);
                    deleteRes.body.statementOfAccount.should.be.a('object');
                    //confirm that it no longer exists in the database
                    let getRes = await StatementOfAccount.getById(id);
                    getRes.should.have.status(404);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /statement-of-account/?minamountPaid=200000&maxamountOutstanding=4000000 success
        */
        describe('/GET statement-of-account | filter | quantitative field | valid', () => {
            let filter = {
                maxamountPaid: 50,
                minamountPaid: 30,
            };
            before(async () => {
                try {
                    await StatementOfAccount.clear();
                    await StatementOfAccount.fill();
                } catch (err) {
                    throw err;
                }
            });
            it('should retrieve only statement of accounts with 3000 <= amountPaid <= 5000', async () => {
                try {
                    let getRes = await StatementOfAccount.getByFilter(filter)
                    getRes.should.have.status(200);
                    getRes.body.statementOfAccounts.should.be.a('array');
                    getRes.body.statementOfAccounts.length.should.eql(2);
                    for (let i = 0; i < 2; i++) {
                        amountPaidInNumber = Number(getRes.body.statementOfAccounts[i].amountPaid)
                        amountPaidInNumber.should.be.above(29.99);
                        amountPaidInNumber.should.be.below(50.01);
                    }
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /statement-of-account/?minamountPaid=200000&maxamountOutstanding=4000000 success
        */
        describe('/GET statement-of-account | filter | quantitative field | valid | combined', () => {
            let filter = {
                minamountPaid: 20,
                maxAmountOverdue: 500
            }
            before(async () => {
                try {
                    await StatementOfAccount.clear();
                    await StatementOfAccount.fill();
                } catch (err) {
                    throw err;
                }
            });
            it('should retrieve only statement of accounts with minamountPaid >= 2000 and amountOutstanding<=40000', async () => {
                try {
                    let getRes = await StatementOfAccount.getByFilter(filter)

                    getRes.should.have.status(200);
                    getRes.body.statementOfAccounts.should.be.a('array');
                    getRes.body.statementOfAccounts.length.should.eql(1);
                    for (let i = 0; i < 1; i++) {
                        amountPaidInNumber = Number(getRes.body.statementOfAccounts[i].amountPaid)
                        amountOverdue = Number(getRes.body.statementOfAccounts[i].amountOverdue)
                        amountPaidInNumber.should.be.above(19.99);
                        amountOverdue.should.be.below(500.01);
                    }
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /statement-of-account/?maxamountOutstanding=null fail
        */
        describe('/GET statement-of-account | filter | invalid', () => {
            it('should retrieve only statement of accounts with minamountPaid >= 2000 and amountOutstanding<=40000', async () => {
                try {
                    try {
                        await StatementOfAccount.clear();
                        await StatementOfAccount.fill();
                    } catch (err) {
                        throw err;
                    }
                    let filter = {
                        maxamountOutstanding: null
                    }
                    let getRes = await StatementOfAccount.getByFilter(filter)
                    getRes.should.have.status(400);
                    getRes.body.should.have.property('error');
                    getRes.body.error.name.should.eql('CastError');
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /statement-of-account/?invalidField=invalidValue fail
        */
        describe('/GET statement-of-account | filter | invalid', () => {
            it('should retrieve only statement of accounts with minamountPaid >= 2000 and amountOutstanding<=40000', async () => {
                try {
                    try {
                        await StatementOfAccount.clear();
                        await StatementOfAccount.fill();
                    } catch (err) {
                        throw err;
                    }
                    let filter = {
                        invalidField: "invalidValue"
                    }
                    let getRes = await StatementOfAccount.getByFilter(filter);
                    getRes.should.have.status(400);
                    getRes.body.should.have.property('error');
                    getRes.body.error.name.should.eql('FilterError');
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * GET /statement-of-account/?invoice=${invoiceObjectID} success
        */
        describe('/GET statement-of-account | filter | invoices | valid', () => {
            it('should retrieve only statement of accounts with valid filters with invoices', async () => {
                try {
                    let filter = {};
                    try {
                        await StatementOfAccount.clear();
                        await StatementOfAccount.fill();
                        const searchedInvoice = StatementOfAccount.data[0].invoices[2];
                        //search for StatementOfAccount that contains this invoice
                        filter.invoices = searchedInvoice;
                    } catch (err) {
                        throw err;
                    }
                    let getRes = await StatementOfAccount.getByFilter(filter);
                    getRes.should.have.status(200);
                    getRes.body.should.have.property('statementOfAccounts');
                    //in our test data, only one StatementOfAccount has that invoice we searched for
                    getRes.body.statementOfAccounts.length.should.eql(1);
                    //check that the values match
                    getRes.body.statementOfAccounts[0].invoices[2].should.eql(filter.invoices);
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            try {
                await StatementOfAccount.reset();
            } catch (err) {
                throw err;
            }
        });
    });
}
module.exports = StatementOfAccountTest;