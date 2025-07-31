

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
let createResource = require('./utils/Resource').createResource;
let ProductModel = require('./../../models/product');
let productData = require('../data/product.input');
let Product = createResource(productData, 'product', 'product', ProductModel);
let UserModel = require('./../../models/user');
let userData = require('../data/user.input');

const createUser = require('./utils/User');
let User = createUser(userData, 'user','user', UserModel);

const createAuthentication = require('./utils/Authentication');

function productTest() {
    //Our parent block
    describe('Product', () => {

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
            Product.Authentication = userAuthentication
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
          * GET /product success
          */
        describe('/GET product', () => {
            it('should GET all documents', async () => {
                try {
                    try {
                        await Product.fill();
                    } catch (err) {
                        throw err;
                    }
                    let getRes = await Product.getAll();
                    getRes.should.have.status(200);
                    getRes.body.products.should.be.a('array');
                    getRes.body.products.length.should.be.eql(4);
                } catch (err) {
                    throw err;
                };
            });
        });
        /*
          * POST /product success
          */
        describe('/POST product', () => {
            let id;
            before(async () => {
                try {
                    await Product.clear();
                } catch (err) {
                    throw err;
                }
            });
            it('should post one document', async () => {
                try {
                    let postRes = await Product.post(Product.data[0])
                    postRes.should.have.status(201);
                    postRes.body.should.be.a('object');
                    postRes.body.product.upc.should.eql(Product.data[0].upc);
                    postRes.body.product.name.should.eql(Product.data[0].name);
                    id = postRes.body.product._id;

                    let getRes = await Product.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.should.be.a('object');
                    getRes.body.product.upc.should.eql(Product.data[0].upc);
                    getRes.body.product.name.should.eql(Product.data[0].name);
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
        * POST /product fail
        */
        describe('/POST Product | invalid | duplicate upc', () => {
            before(async () => {
                try {
                    await Product.clear();
                    let postRes = await Product.post(Product.data[0])
                    postRes.should.have.status(201);
                    postRes.body.should.be.a('object');
                    postRes.body.product.upc.should.eql(Product.data[0].upc);
                    postRes.body.product.name.should.eql(Product.data[0].name);
                } catch (err) {
                    throw err;
                }
            });
            it('should post one document but not post the second because upc need to be unique', async () => {
                try {
                    let postRes = await Product.post(Product.data[0]);
                    postRes.should.have.status(400);
                    postRes.body.should.be.a('object');
                } catch (err) {
                    throw err;
                }
            });
        });
        /*
          * PUT /product/:id success
          */
        describe('/PUT product', () => {
            let id;
            let oldName = Product.data[0].name;
            before(async () => {
                try {
                    await Product.clear();
                    let postRes = await Product.post(Product.data[0]);
                    id = postRes.body.product._id;
                    Product.data[0].name = 'new name'
                } catch (err) {
                    throw err;
                }
            });
            it('should update a posted document', async () => {
                try {
                    let putRes = await Product.put(id, Product.data[0]);
                    putRes.should.have.status(201);
                    putRes.body.product.should.be.a('object');
                    putRes.body.product.should.have.property('name');
                    putRes.body.product.name.should.eql(Product.data[0].name);

                    let getRes = await Product.getById(id);
                    getRes.should.have.status(200);
                    getRes.body.product.should.be.a('object');
                    getRes.body.product.should.have.property('name');
                    getRes.body.product.name.should.eql(Product.data[0].name);
                } catch (err) {
                    throw err;
                }
            });
            after(() => {
                //return name to old name
                Product.data[0].name = oldName;
            });
        });
        /*
          * DELETE /product/:id success
          */
        describe('/DELETE product', () => {
            let id;
            before(async () => {
                try {
                    await Product.clear();
                    postRes = await Product.post(Product.data[0]);
                    id = postRes.body.product._id;
                } catch (err) {
                    throw err;
                }
            });
            it('should delete a posted document', async () => {
                try {
                    //post a new payment type and retrieve its _id property
                    let deleteRes = await Product.delete(id)
                    deleteRes.should.have.status(200);
                    let getRes = await Product.getById(id)
                    getRes.should.have.status(404);
                } catch (err) {
                    throw err;
                }
            });
        });
        after(async () => {
            try {
                await Product.clear();
            } catch (err) {
                throw err;
            }
        })
    });
}
module.exports = productTest;