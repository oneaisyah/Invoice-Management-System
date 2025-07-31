//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../../app');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
class Authentication {
    constructor(username, password, roleLevel) {
        this.username = username;
        this.password = password;
        this.roleLevel = roleLevel;
        this.bearer = null;
    }
    setUsername(username) {
        this.username = username;
    }
    setPassword(password) {
        this.password = password;
    }
    setRoleLevel(roleLevel) {
        this.roleLevel = roleLevel;
    }
    setToken(bearerToken) {
        this.bearer = bearerToken;
    }
    setCredentials(username, password) {
        this.setUsername(username);
        this.setPassword(password);
    }
    attemptLogin() { //* Call this function outside this scope

        return chai.request(app)
            .post(`/authenticate/login`)
            .send({ username: this.username, password: this.password });
    }
    authenticate() {
        return chai.request(app)
        .post(`/authenticate`)
        .set( {"Authorization": `${this.bearer}`} )
        .then((res) => {
            return res
        }).catch((err) =>{
            console.log(err);
            return err
        });
        
    }
    reset() {
        this.username = null;
        this.password = null;
        this.roleLevel = null;
        this.bearer = null;
    }
}
createAuthentication = (username, password, roleLevel) => { //* AKA log in
    return new Authentication(username, password, roleLevel)
}
module.exports = createAuthentication;