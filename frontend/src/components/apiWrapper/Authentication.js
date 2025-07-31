import { useAuthContext } from "../../hooks/useAuthContext";
import Resource from "./Resource"

class AuthenticationResource extends Resource {
    constructor() {
        super('authenticate', 'authenticate');
    }

    async login(username, password) {
        const loginBody = {
            username,
            password
        }
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}/login`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginBody)
        })
        if (rawResponse.status === 201) {
            console.log(`${requestURLPath} login() operation was successful.`)
            const responseBody = await rawResponse.json();
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            localStorage.setItem('user', JSON.stringify(responseBody));
            return responseBody;
        }
        console.log(`${requestURLPath} login() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        const detailedError = new Error(`${requestURLPath} login() operation was unsuccessful. Status code is ${rawResponse.status}!`);
        detailedError.status = rawResponse.status;

        throw detailedError;
    }

    async authenticate() {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        })
        if (rawResponse.status === 201) {
            console.log(`${requestURLPath} authenticate() operation was successful.`)
            console.log(`${requestURLPath} response returns this: ${rawResponse}`)
            return rawResponse.json();
        }
        console.log(`${requestURLPath} authenticate() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} authenticate() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }
}
const Authentication = new AuthenticationResource();
export default Authentication;