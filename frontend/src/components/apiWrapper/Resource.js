class Resource { //! PARENT CLASS
    constructor(route, resourceName) {

        this.route = route;
        //* For invoice, this is 'invoice'. For supplier, this is 'supplier'
        this.resourceName = resourceName;
        this.baseURLToSendHTTPRequest = "http://localhost:8888";

    }

    // eslint-disable-next-line class-methods-use-this
    convertJSONFiltersToQueryParameters(JSONFilterToProcess) {
        let queryParameters = '';
        if (Object.keys(JSONFilterToProcess).length > 0) {
            try {
                queryParameters = new URLSearchParams(JSONFilterToProcess);
                console.log(`Resource.convertJSONFiltersToQueryParameters returns:${queryParameters}`)
            } catch (err) {
                console.log(`Error in your filters JSON structure in your request!:${err}`)
            }
        } else {
            console.log('Process JSON Filter: No keys detected in filter JSON object to process!')
        }
        return queryParameters;
    }

    async getCSV(invoiceID) {
        window.open(`${this.baseURLToSendHTTPRequest}/${this.route}/csv?invoiceid=${invoiceID}`, '_blank');
    }

    async getAll() {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}`;
        const response = await fetch(requestURLPath, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token

            }
        });

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            console.log(response.error);
            throw new Error(response.error);
        } else {
            return data[`${this.resourceName}`];
        }
    }

    async getAllPopulated() {
        const queryParameters = this.convertJSONFiltersToQueryParameters({ populate: true });
        console.log('query parameters in getAllPopulated', queryParameters);
        const response = await fetch(`${this.baseURLToSendHTTPRequest}/${this.route}?${queryParameters}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token

            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
            throw new Error(response.error);
        } else {
            return data[`${this.resourceName}s`];
        }
    }

    async getWithFilter(filter) {
        const queryParams = new URLSearchParams(filter);
        const response = await fetch(`${this.baseURLToSendHTTPRequest}/${this.route}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token

            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(response.error);
        } else {
            console.log('product data', data[`${this.resourceName}s`]);

            return data[`${this.resourceName}s`];

        }
    }

    async getById(id) {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}/${id}?populate=true`;

        const rawResponse = await fetch(requestURLPath, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        })

        if (rawResponse.status === 200) {
            console.log(`${requestURLPath} getById() operation was successful.`)
            const responseBody = await rawResponse.json();
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            return responseBody[`${this.resourceName}`];
        }
        console.log(`${requestURLPath} getById() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} getById() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }

    async getByFilter(filtersInJSON) {
        const queryParameters = this.convertJSONFiltersToQueryParameters(filtersInJSON);
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}?${queryParameters}`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        })



        if (rawResponse.ok) {
            const responseBody = await rawResponse.json();
            console.log("\n\n\n🚀 ~ file: Resource.js:112 ~ Resource ~ getByFilter ~ FOR YOUR CONVENIENCE THIS IS WHAT IS RESPONDED:");

            console.log("🚀 ~ file: Resource.js:110 ~ Resource ~ getByFilter ~ responseBody STRINGIFIED:", JSON.stringify(responseBody));

            console.log("🚀 ~ file: Resource.js:110 ~ Resource ~ getByFilter ~ responseBody PARSED:", JSON.parse(JSON.stringify(responseBody)));


            console.log(`${requestURLPath} getByFilter() operation was successful.`)
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            return responseBody[`${this.resourceName}s`];

        }
        console.log(`${requestURLPath} getByFilter() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} getByFilter() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }

    async post(dataInJSON) {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
            body: JSON.stringify(dataInJSON)
        })
        if (rawResponse.status === 201) {
            console.log(`${requestURLPath} post() operation was successful.`)
            const responseBody = await rawResponse.json();
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            return responseBody[`${this.resourceName}`];
        }
        console.log(`${requestURLPath} post() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} post() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }

    async put(idOfResourceToEdit, dataInJSON) {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}/${idOfResourceToEdit}`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
            body: JSON.stringify(dataInJSON)
        })
        if (rawResponse.status === 201) {
            console.log(`${requestURLPath} put() operation was successful.`)
            const responseBody = await rawResponse.json();
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            return responseBody[`${this.resourceName}`];

        }
        console.log(`${requestURLPath} put() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} put() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }

    async delete(idOfResourceToDelete) {
        const requestURLPath = `${this.baseURLToSendHTTPRequest}/${this.route}/${idOfResourceToDelete}`;
        const rawResponse = await fetch(requestURLPath, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        })
        if (rawResponse.status === 200) {
            console.log(`${requestURLPath} delete() operation was successful.`)
            const responseBody = await rawResponse.json();
            console.log(`${requestURLPath} response.json() returns this: ${responseBody}`)
            return responseBody[`${this.resourceName}`];
        }
        console.log(`${requestURLPath} delete() operation was unsuccessful.`)
        console.log(`${requestURLPath} response.status is ${rawResponse.status}.`)
        throw new Error(`${requestURLPath} delete() operation was unsuccessful. Status code is ${rawResponse.status}!`)
    }
}
export default Resource