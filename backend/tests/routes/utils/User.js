
let chai = require('chai');
let app = require('../../../app');
const { Resource } = require('./Resource');
const UserModel = require('`../../../models/user');
const createAuthentication = require('./Authentication');
class UserResource extends Resource {
    constructor(data, route, resourceName, Model) {//* No authentication at the start; will set it in subsequent lines
        super(data, route, resourceName, Model, null)
        const { username, password } = data[0];
        if ((!username) || (!password)) {
            console.log("First post => no valid username or password!");
            throw Error('firstPost: No username or password field!')
        }
        
    }    
    
    async firstPost(data) { //* Modified from Resource parent:  excludes authorization header
        return chai.request(app)
            .post(`/${this.route}`)
            .send(data);
    }

    async put(id, data) { //* Modified from Resource parent: no need to put internal ID. It can be inferred from token.
        return chai.request(app)
            .put(`/${this.route}/${id}`) //* Modified from Resource parent: no need to put internal ID in URL
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .send(data);
    }

    async fill() {
        try {
            await this.clear();
            for (let i = 0; i < this.data.length; i++) {
                await this.post(this.data[i]); //* Modified from Resource parent: no need to extract out internal ID
            }
        } catch (err) {
            throw err;
        }
    }
}
function createUser(data) {
    return new UserResource(data, 'user', 'user', UserModel);
}
module.exports = createUser;