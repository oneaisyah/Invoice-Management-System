//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let createResource = require('./utils/Resource').createResource;
let SupplierModel = require('./../../models/supplier');
let supplierData = require('../data/supplier.input');
let Supplier = createResource(supplierData, 'supplier', 'supplier', SupplierModel);

let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');

function supplierTest() {
    
    
    describe('supplier', () => {
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
            Supplier.Authentication = userAuthentication
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
        * GET /supplier success
        */
        describe('/GET supplier', () => {
            it('should GET all documents', async () => {
                try {
                    await Supplier.fill();
                    let getRes = await Supplier.getAll();
                    getRes.should.have.status(200);
                    getRes.body.suppliers.should.be.a('array');
                    getRes.body.suppliers.length.should.be.eql(3);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * POST /supplier success
          */
        describe('/POST supplier', () => {
            let id;
            before(async () => {
                try {
                    await Supplier.clear();
                } catch (err) {
                    throw err;
                }
            });
            it('should post one document', async () => {
                try {
                    let postRes = await Supplier.post(Supplier.data[0]);
                    postRes.should.have.status(201);
                    postRes.body.supplier.should.be.a('object');
                    postRes.body.supplier.should.have.property('name');
                    postRes.body.supplier.name.should.eql(Supplier.data[0].name);
                    id = postRes.body.supplier._id;

                    let getRes = await Supplier.getById(id)
                    getRes.should.have.status(200);
                    getRes.body.supplier.should.be.a('object');
                    getRes.body.supplier.should.have.property('name');
                    getRes.body.supplier.name.should.eql(Supplier.data[0].name);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * PUT /supplier/:id success
          */
        describe('/PUT supplier', () => {
            let id;
            let oldName;
            before(async () => {
                try {
                    await Supplier.clear();
                    let postRes = await Supplier.post(Supplier.data[0])
                    id = postRes.body.supplier._id;
                    oldName = Supplier.data[0].name;
                    Supplier.data[0].name = "Calbee";
                } catch (err) {
                    throw err;
                }
            });
            it('should update a posted document', async () => {
                try {
                    let putRes = await Supplier.put(id, Supplier.data[0])
                    putRes.should.have.status(201);
                    putRes.body.supplier.should.be.a('object');
                    putRes.body.supplier.should.have.property('name');
                    putRes.body.supplier.name.should.eql(Supplier.data[0].name);

                    let getRes = await Supplier.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.supplier.should.be.a('object');
                    getRes.body.supplier.should.have.property('name');
                    getRes.body.supplier.name.should.eql(Supplier.data[0].name);
                } catch (err) {
                    throw err;
                }
            });
            after(() => {
                Supplier.data[0].name = oldName;
            })
        });
        /*
          * DELETE /supplier/:id success
          */
        describe('/DELETE supplier', () => {
            let id;
            before(async () => {
                try {
                    await Supplier.clear();
                    let postRes = await Supplier.post(Supplier.data[0]);
                    id = postRes.body.supplier._id;
                } catch (err) {
                    throw err;
                }
            });
            it('should delete a posted document', async () => {
                try {
                    let deleteRes = await Supplier.delete(id);
                    deleteRes.should.have.status(200);

                    let getRes = await Supplier.getById(id);
                    getRes.should.have.status(404);
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            await Supplier.clear();
        })
    });
}
module.exports = supplierTest;