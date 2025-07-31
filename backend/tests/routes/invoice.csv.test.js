
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const { invoicesToPost } = require('../data/invoice.csv.input');
let createInvoice = require('./utils/Invoice');
let Invoice = createInvoice(invoicesToPost);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');
const { assert } = require('chai');
const { getInvoiceCSV } = require('../../pipelines/invoiceCSVPipeline');


function InvoiceCSVTest() {
    describe('INVOICE CSV TEST', () => {
                
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
                Invoice.Authentication = userAuthentication;
    
                await User.fill();
    
            });
            afterEach(async () => {
                await User.clear();
                await Invoice.clear();
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
    
        describe('/GET invoice/csv | no filter', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await Invoice.initialise();
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {};
                    csvResponse = await Invoice.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getInvoiceCSV(filter) //! We assume that the getInvoiceCSV function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })
        
        describe('/GET invoice/csv | non-quantitative field filter', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await Invoice.initialise();
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {invoiceid: "INV-2023-04/DEF/01"};
                    csvResponse = await Invoice.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getInvoiceCSV(filter) //! We assume that the getInvoiceCSV function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })

        describe('/GET invoice/csv | quantitative field filter min total price before gst only', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await Invoice.initialise();
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {
                        minTotalPriceBeforeGST:100000
                    };
                    csvResponse = await Invoice.getCSV(filter);

                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getInvoiceCSV(filter) //! We assume that the getInvoiceCSV function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })

        describe('/GET invoice/csv | quantitative field filter min and max total price before gst', () => {
            it('The CSV call should have all the fields and correct number of rows.', async () => {
                
                try {
                    await Invoice.initialise();
                    await Invoice.fill();
                }
                catch (err) {
                    throw err;
                }
                let csvResponse;
                try {

                    filter = {
                        minTotalPriceBeforeGST:6000000,
                        maxTotalPriceBeforeGST:6480000
                    };
                    csvResponse = await Invoice.getCSV(filter);
                    expect(csvResponse.status).to.equal(200);
                    expect(csvResponse).to.have.property('text');
                    //* After this try block we will test for content matching.
                } catch(err) {
                    throw err
                }
                const expectedCSV =  await getInvoiceCSV(filter) //! We assume that the getInvoiceCSV function works.
                assert.equal(csvResponse.text, expectedCSV);
            })
        })
    });
}
module.exports = InvoiceCSVTest;