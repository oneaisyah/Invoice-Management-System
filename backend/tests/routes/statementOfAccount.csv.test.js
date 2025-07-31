
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const { statementOfAccountData } = require('../data/statementOfAccount.input');

let createStatementOfAccount = require('./utils/StatementOfAccount');
let StatementOfAccount = createStatementOfAccount(statementOfAccountData);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');
const { assert } = require('chai');
const { getStatementOfAccountCSV } = require('../../pipelines/statementOfAccountCSVPipeline');


function StatementOfAccountCSVTest() {
    describe('STATEMENT OF ACCOUNT CSV TEST', () => {
                
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
                await StatementOfAccount.clear();
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
    
        describe('/GET statement-of-account/csv | no filter', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await StatementOfAccount.initialise();
                    await StatementOfAccount.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {};
                    csvResponse = await StatementOfAccount.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getStatementOfAccountCSV(filter) //! We assume that the getStatementOfAccount function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })
        
        describe('/GET statement-of-account/csv | non-quantitative field filter', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await StatementOfAccount.initialise();
                    await StatementOfAccount.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {referenceNumber: "000000000002"};
                    csvResponse = await StatementOfAccount.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getStatementOfAccountCSV(filter) //! We assume that the getStatementOfAccount function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })

        describe('/GET statement-of-account/csv | quantitative field filter min amount outstanding only', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await StatementOfAccount.initialise();
                    await StatementOfAccount.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {
                        minAmountOutstanding: 100000
                    };
                    csvResponse = await StatementOfAccount.getCSV(filter);

                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getStatementOfAccountCSV(filter) //! We assume that the getStatementOfAccount function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })

        describe('/GET statement-of-account/csv | quantitative field filter min and max amount outstanding', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await StatementOfAccount.initialise();
                    await StatementOfAccount.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {
                        minAmountOutstanding:100000,
                        maxAmountOutstanding:600000
                    };
                    csvResponse = await StatementOfAccount.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getStatementOfAccountCSV(filter) //! We assume that the getStatementOfAccount function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })
    });
}
module.exports = StatementOfAccountCSVTest;