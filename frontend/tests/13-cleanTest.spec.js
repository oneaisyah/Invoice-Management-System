const fetch = require('node-fetch');

async function getToken() {
    const response = await fetch('http://localhost:8888/authenticate/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: "seand",
            password: "123"
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    } else {
        return data.token;
    }
}

const backendURL = "http://localhost:8888/"

async function getAll(resource) {
    const backendURLSupplier = backendURL + resource + "/"
    const token = await getToken()
    const response = await fetch(backendURLSupplier, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
    } else {
        console.log("Error");
    }
}

async function findId(resource, name) {
    for (let i = 0; i < resource.length; i++) {
        if (resource[i].name == name) {
            return resource[i]._id
        }
    }
}

async function deleteById(resource, id) {
    const backendURLSupplier = backendURL + resource + "/" + id
    const token = await getToken()
    const response = await fetch(backendURLSupplier, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (response.ok) {
        const responseJson = await response.json();
        return responseJson;
    } else {
        console.log("Error");
    }
}

async function deleteTestSupplier(name) {
    const supplierObject = await getAll("supplier")
    const suppliers = supplierObject.suppliers
    const supplierId = await findId(suppliers, name)
    await deleteById("supplier", supplierId)
    console.log("Deleted")
}

async function deleteTestProduct(name) {
    const productObject = await getAll("product")
    const products = productObject.products
    const productId = await findId(products, name)
    await deleteById("product", productId)
    console.log("Deleted")
}

async function deleteTestRecipient(name) {
    const paymentObject = await getAll("payment")
    const payments = paymentObject.payments
    let paymentId
    for (let i = 0; i < payments.length; i++) {
        if (payments[i].recipientName == name) {
            paymentId = payments[i]._id
        }
    }
    await deleteById("payment", paymentId)
    console.log("Deleted")
}

async function deleteTestInvoice(name) {
    const invoiceObject = await getAll("invoice")
    const invoices = invoiceObject.invoices
    let invoiceId
    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].invoiceID == name) {
            invoiceId = invoices[i]._id
        }
    }
    await deleteById("invoice", invoiceId)
    console.log("Deleted")
}

async function deleteTestUser(name) {
    const userObject = await getAll("user")
    const users = userObject.user
    let userId
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == name) {
            userId = users[i]._id
        }
    }
    await deleteById("user", userId)
    console.log("Deleted")
}

async function main() {
    await deleteTestInvoice("0000001");
    await deleteTestSupplier("Test Supplier")
    await deleteTestSupplier("Test Supplier 1")
    await deleteTestSupplier("Test Supplier 3")
    await deleteTestProduct("Test Product 1")
    await deleteTestProduct("Test Product")
    await deleteTestRecipient("Test Recipient")
    await deleteTestUser("Test Staff 1")
    await deleteTestUser("Test Staff 2")
    await deleteTestUser("Test Branch Manager 1")
}

main()