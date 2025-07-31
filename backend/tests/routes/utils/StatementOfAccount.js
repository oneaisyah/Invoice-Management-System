

let chai = require('chai');
let app = require('../../../app');

const { Resource, createResource } = require("./Resource");
const paymentData = require("../../data/payment.input");
const supplierData = require("../../data/supplier.input");
const PaymentModel = require('../../../models/payment');
const SupplierModel = require('../../../models/supplier');
const StatementOfAccountModel = require('../../../models/statementOfAccount');
const createAuthentication = require('./Authentication');


const Payment = createResource(paymentData, 'payment', 'payment', PaymentModel);
const Supplier = createResource(supplierData, "supplier", "supplier", SupplierModel);
const { invoiceData } = require('../../data/invoice.input');
const createInvoice = require('./Invoice');
const Invoice = createInvoice(invoiceData);
class StatementOfAccountResource extends Resource {
    constructor(data, Supplier, Payment, Invoice, route, resourceName, Model, Authentication) {
        super(data, route, resourceName, Model, Authentication);
        this.data = data;
        this.Supplier = Supplier;
        this.Payment = Payment;
        this.Invoice = Invoice;
    }
    async initialise() {
        await this.reset();
        this.Payment.Authentication = this.Authentication;
        this.Invoice.Authentication = this.Authentication;
        this.Supplier.Authentication = this.Authentication;
        await this.Payment.fill();
        await this.Supplier.fill();
        await this.Invoice.initialise();
        await this.Invoice.fill();
        // console.log('all invoices', this.Invoice.data);
        // console.log('all payments', this.Payment.data);
        // console.log('all invoices', this.Invoice.data);
        // console.log('all payments', this.Payment.data);
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].supplier = this.Supplier.data[i]._id;
            for (let j = this.data.length * i; j < this.data.length * (i + 1); j++) {
                this.data[i].payments[j - (this.data.length * i)] = this.Payment.data[j]._id;
                // console.log('payment', this.data[i].payments[j - (this.data.length * i)]);
            }
            for (let j = this.data.length * i; j < this.data.length * (i + 1); j++) {
                this.data[i].invoices[j - (this.data.length * i)] = this.Invoice.data[j]._id;
                // console.log('invoice', this.data[i].invoices[j - (this.data.length * i)]);
                // console.log('invoice', this.data[i].invoices[j - (this.data.length * i)]);
            }

            // console.log(this.data[i]);
            // console.log(this.data[i]);
        }
    }
    async getCSV(filter) {
        return chai.request(app)
            .get(`/${this.route}/csv`)
            .set({ "Authorization": `${this.Authentication.bearer}` })
            .query(filter);
    }
    async reset() {
        await this.Invoice.reset();
        await this.Supplier.clear();
        await this.Payment.clear();
        await this.clear();
    }
}
function createStatementOfAccount(data) {
    const Authentication = createAuthentication('sean', '123');
    return new StatementOfAccountResource(data, Supplier, Payment, Invoice, 'statement-of-account', 'statementOfAccount', StatementOfAccountModel, Authentication);
}

module.exports = createStatementOfAccount;