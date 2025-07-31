//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

let userData = require('../data/user.input');
const createUser = require('./utils/User');
let User = createUser(userData);
const createAuthentication = require('./utils/Authentication');


function userTests() {
    //Our parent block
    describe('USER ROUTE TEST BEGIN', () => {
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
            await User.fill();

        });
        
        describe('/GET user', () => {
            it('should GET all users', async () => {
                try {
                    let getRes = await User.getAll();
                    getRes.should.have.status(200);
                    getRes.body.user.should.be.a('array');
                    getRes.body.user.length.should.be.eql(3);
                } catch (err) {
                    console.log(err);
                    throw err;
                }
            });
        });
        
        describe('/POST user', () => {
            it('Empty database => should successfully post one document without token', async () => {

                try {
                    await User.clear();
                    let postRes = await User.post(User.data[0]);
                    id = postRes.body.user._id;
                    let getRes = await User.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.user[0].should.have.property('username');
                    getRes.body.user[0].should.have.property('roleLevel');
                    getRes.body.user[0].username.should.eql('sean');
                    return getRes
                } catch (err) {
                    throw err;
                }
            });
        });        
        
        describe('/POST user', () => {
            it("Database with >= 1 user => should successfully post one document with token, assuming posting user's authentication level is higher than user being posted", async () => {
                try {
                    User.Authentication = null;
                    //* First post (empty database); assumed to pass; based on previous test
                    const firstData = User.data[0];
                    await User.firstPost(firstData);
                    const {username, password, roleLevel} = firstData;
                    userAuthentication = createAuthentication(username, password, roleLevel);
                    loginResponse = await userAuthentication.attemptLogin();
                    userAuthentication.setToken(`Bearer ${loginResponse.body.token}`);
                    User.Authentication = userAuthentication;
                    let postRes = await User.post(User.data[1]);

                    id = postRes.body.user._id;

                    //* Log in to the account User.data[0] to obtain authentication token and role level to create anymore users.
                    
                    //* Second post (non-empty database); this is the test

                    let getRes = await User.getById(id);

                    getRes.should.have.status(200);
                    getRes.body.user[0].should.have.property('username');
                    getRes.body.user[0].should.have.property('roleLevel');

                } catch (err) {
                    throw err;
                }
            });
        });
        
        describe('/PUT user', () => {
            let id2;
            let username2;
            let newData;
            beforeEach(async () => {
                try {
                    await User.clear()
                    const firstData = User.data[0];
                    const response1 = await User.firstPost(firstData);
                    let {username, password, roleLevel} = firstData;
                    userAuthentication = createAuthentication(username, password, roleLevel);
                    loginResponse = await userAuthentication.attemptLogin();
                    userAuthentication.setToken(`Bearer ${loginResponse.body.token}`);

                    //* Authentication is first user; first user modifying second user rights.
                    let secondPostRes = await User.post(User.data[1]);
                    username2 = secondPostRes.body.user.username;
                    id2 = secondPostRes.body.user._id;

                    newData = {
                        username: 'changedUsername',
                        roleLevel: 0,
                    };
                } catch (err) {
                    throw err;
                }
            });
            it('should update a posted document', async () => {
                
                try {
                    await User.put(id2, newData);


                    let getRes = await User.getById(id2);

                    getRes.should.have.status(200);
                    getRes.body.user[0].should.have.property('username');
                    getRes.body.user[0].should.have.property('roleLevel');
                    getRes.body.user[0].username.should.eql('changedUsername');
                    getRes.body.user[0].roleLevel.should.eql(0);
                    return getRes
                } catch (err) {
                    throw err;
                }
            });
        });

        describe('/DELETE user', () => {
            let id;
            beforeEach(async () => {
                try {
                    await User.clear();
                    let postRes = await User.post(User.data[0]);
                    id = postRes.body.user._id;
                    
                } catch (err) {
                    throw err
                }
            });
            it('should delete a posted document', async () => {
                try {
                    const deleteRes = await User.delete(id)
                    deleteRes.should.have.status(200);
                    const getRes = await User.getById(id);

                    getRes.should.have.status(200);
                    getRes.body.user.should.be.a('array');
                    getRes.body.user.length.should.be.eql(0);
                    return getRes
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            try {
                await User.clear();
            } catch (err) {
                throw err;
            }
        })
    });
    
}
module.exports = userTests;