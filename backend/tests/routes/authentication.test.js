//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect();

let app = require('../../app');

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');
const { generateArrayOfRandomStrings, tokenCharacterSet } = require('./utils/stringFuzzer');
chai.use(chaiHttp);


function authenticationTest() {
    describe('AUTHENTICATION ROUTE TEST BEGIN', () => {
        
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
        beforeEach(async () => {
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
        
        describe('POST /authenticate/login | CORRECT credentials', () => {
            it('should give a 201 success status', async () => {
                try {
                    for (let i = 0; i < User.data.length; i++) { 
                        user = User.data[i]
                        const {username, password, roleLevel} = user;
                        userAuthentication = createAuthentication(username, password, roleLevel);
                        loginResponse = await userAuthentication.attemptLogin();
                        
                        loginResponse.status.should.be.eql(201);
                        loginResponse.body.should.have.property('roleLevel');
                        loginResponse.body.should.have.property('token');
                    }

                } catch (err) {
                    throw(err);
                }

            })
        });
        describe('POST /authenticate/login | INCORRECT credentials', () => {
            it('should give a 401 error status', async () => {
                try {
                    for (let i = 0; i < User.data.length; i++) {
                        user = User.data[i]
                        const {username, password, roleLevel} = user;
                        userAuthentication = createAuthentication(username, 'INCORRECTPASSWORD', roleLevel);
                        loginResponse = await userAuthentication.attemptLogin();
                        loginResponse.status.should.be.eql(401);
                        loginResponse.body.should.not.have.property('roleLevel');
                        loginResponse.body.should.not.have.property('token');
                    }
                } catch (err) {
                    throw(err);
                }
            })
        });
        describe('POST /authenticate/ | Token is valid', () => {
            it('should give a 201 success status', async () => {

                //* TODO: Showcase on last day; testing + the next test: fuzz testing for invalid token strings
                try {
                    for (let i = 0; i < User.data.length; i++) {
                        user = User.data[i]
                        const {username, password, roleLevel} = user;
                        userAuthentication = createAuthentication(username, password, roleLevel);
                        loginResponse = await userAuthentication.attemptLogin();
                        await userAuthentication.setToken(`Bearer ${loginResponse.body.token}`);
                        authenticateResponse = await userAuthentication.authenticate();
                        authenticateResponse.status.should.be.equal(201);
                    }
                    
                } catch (err) {
                    throw(err);
                }
                
            })
        });
        describe('POST /authenticate/ | Token is invalid', () => {
            it('should give a 401 error status', async (done) => {
                arrayOfRandomStrings = generateArrayOfRandomStrings(20, tokenCharacterSet, 171);
                arrayOfRandomStrings.forEach(async (fuzzedToken) => {
                    let res;
                    try {
                        res = await chai.request(app)
                        .post(`/authenticate`)
                        .set( {"Authorization": `${fuzzedToken}`} )
                    } catch(err) {
                        throw err
                    }
                    res.status.should.be.eql(401);
                });
                done();
            })  
        });
        describe('GET /invoice | Token is invalid', () => {
            it('should give a 401 error status', async () => {
                arrayOfRandomStrings = generateArrayOfRandomStrings(1, tokenCharacterSet, 171);
                arrayOfRandomStrings.forEach(async (fuzzedToken) => {
                    let res;
                    try {
                        res = await chai.request(app)
                        .get(`/invoice`)
                        .set( {"Authorization": `${fuzzedToken}`} )
                    } catch(err) {
                        throw err
                    }
                    res.status.should.be.eql(401);
                });
            })  
        });
    })
}
module.exports = authenticationTest;