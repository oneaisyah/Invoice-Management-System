
let chai = require('chai');
let app = require('../../../app');
const fs = require('fs');
const csv = require('csv-parser');
const { finished } = require('stream/promises');
const { Resource, createResource } = require('./Resource');

const supplierData = require('../../data/supplier.input');
const productData = require('../../data/product.input');
const paymentTypeData = require('../../data/paymentType.input');

const createAuthentication = require('./Authentication');

const SupplierModel = require('`../../../models/supplier');
const ProductModel = require('../../../models/product');
const PaymentTypeModel = require('../../../models/paymentType');
const { getInvoiceCSV, invoicePipeline } = require('../../../pipelines/invoiceCSVPipeline');
const Invoice = require('../../../models/invoice');

const Supplier = createResource(supplierData, 'supplier', 'supplier', SupplierModel);
const Product = createResource(productData, 'product', 'product', ProductModel);
const PaymentType = createResource(paymentTypeData, 'payment-type', 'paymentType', PaymentTypeModel);

class InvoiceResource extends Resource {
    constructor(data, Supplier, Product, PaymentType, route, resourceName, Model, Authentication) {
        super(data, route, resourceName, Model, Authentication);
        this.Supplier = Supplier;
        this.Product = Product;
        this.PaymentType = PaymentType;
    }
    async initialise() {
        try {

            this.Supplier.Authentication = this.Authentication;
            this.Product.Authentication = this.Authentication;
            this.PaymentType.Authentication = this.Authentication;
            await this.reset();
            await this.Supplier.fill();
            await this.Product.fill();
            await this.PaymentType.fill();
            for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].productIDPriceQuantity.length; j++) {
                    this.data[i].productIDPriceQuantity[j].productID = this.Product.data[j]._id;
                }
                this.data[i].paymentType = this.PaymentType.data[0]._id;
                this.data[i].supplier = this.Supplier.data[Math.floor(i / 3)]._id;
            }

        } catch (err) {
            throw err;
        }
    }
    async aggregate(filter) {
        return this.Model.aggregateFunction(filter);
    }
    async getCSV(filter) {
        return chai.request(app)
            .get(`/${this.route}/csv`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .query(filter);
    }
    async convertCSVToJSONArray(path) {
        const results = [];
        const parser = fs.createReadStream(path)
            .pipe(csv())
            .on('data', (data) => results.push(data));
        await finished(parser);
        return results;
    }
    async reset() {
        await this.clear();
        await this.Supplier.clear();
        await this.Product.clear();
        await this.PaymentType.clear();
    }
}
function createInvoice(data) {
    const Authentication = createAuthentication('sean', '123');
    return new InvoiceResource(data, Supplier, Product, PaymentType, 'invoice', 'invoice', Invoice, Authentication);
}
module.exports = createInvoice;