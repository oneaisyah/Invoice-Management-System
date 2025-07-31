//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app');
const createAuthentication = require('./Authentication');
//use test account for Authentication
chai.use(chaiHttp);
class Resource {
    constructor(data, route, resourceName, Model, Authentication) {
        this.data = data;
        this.route = route;
        this.resourceName = resourceName;
        this.Model = Model;
        this.Authentication = Authentication;
    }
    async fill() {
        try {
            await this.clear();
            for (let i = 0; i < this.data.length; i++) {
                const postRes = await this.post(this.data[i]);
                this.data[i]._id = postRes.body[this.resourceName]._id;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async clear() { //! CLEAR NEVER REMOVES .Authentication PROPERTY!. So even if you data in database is remove, the token still remains.
        try {
            await this.Model.deleteMany({});
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].hasOwnProperty("_id"))
                    delete this.data[i]._id;
            }
        } catch (err) {
            throw err;
        }
    }
    async getAll() {
        return chai.request(app)
            .get(`/${this.route}`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
    }
    async getById(id) {
        return chai.request(app)
            .get(`/${this.route}/${id}`)
            .set({ "Authorization": `${this.Authentication.bearer}` });
    }
    async getByFilter(filter) {
        return chai.request(app)
            .get(`/${this.route}`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .query(filter);
    }
    async post(doc) {
        return chai.request(app)
            .post(`/${this.route}`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .send(doc);
    }
    async put(id, doc) {
        return chai.request(app)
            .put(`/${this.route}/${id}`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .send(doc);
    }
    async delete(id) {
        return chai.request(app)
            .delete(`/${this.route}/${id}`)
            .set({ "Authorization": `${this.Authentication.bearer}` });
    }
}
function createResource(data, route, resourceName, Model) {
    const Authentication = createAuthentication('sean', '123');
    return new Resource(data, route, resourceName, Model, Authentication);
}
module.exports = { createResource, Resource };