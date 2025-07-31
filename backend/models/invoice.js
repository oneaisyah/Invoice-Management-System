

const mongoose = require("mongoose");
const getFilter = require("../utils/filter/invoice");
const Schema = mongoose.Schema;
const StatementOfAccount = require('./sharedUtils/statementOfAccountUpdateMany');
const productIDPriceQuantitySchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const invoiceSchema = new Schema({
    productIDPriceQuantity: [productIDPriceQuantitySchema],
    invoiceID: { type: String, required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "supplier", required: true },
    dateOfPurchase: {
        type: Date, required: true,
        validate: {
            validator: dateOfPurchaseValidator,
            message: "dateOfPurchase must be before today's date"
        }
    },
    paymentType: { type: Schema.Types.ObjectId, ref: "paymentType" },
    paid: {
        type: Boolean, required: true,
    },
    totalPriceBeforeGST: {
        type: Number, required: true,
        validate: {
            validator: totalPriceBeforeGSTValidator,
            message: "totalPriceBeforeGST must be equal to total value of productIDPriceQuantity"
        }
    },
    totalPriceAfterGST: {
        type: Number, required: true,
        validate: {
            validator: totalPriceAfterGSTValidator,
            message: "totalPriceAfterGST must be more than totalPriceBeforeGST in cents, \
            \n Suppose 100 < totalPriceAfterGST < 101 if totalPriceAfterGST>=100.5, round up to 101, else, round down to 100"
        }
    },
    imageLink: {
        type: String,
        validate: {
            validator: imageLinkValidator,
            message: "image link must be a valid HTTP or HTTPS URL"
        }
    }
}, {
    timestamps: true
});
function totalPriceBeforeGSTValidator(newTotal) {

    let net_price = (newTotal * 100);
    let total_price = (this.totalPriceAfterGST * 100)
    const items = this.productIDPriceQuantity.map(item => {
        item.price = (item.price * 100)
        return item;
    });
    let actualTotal = 0;
    items.forEach((item) => {
        actualTotal = actualTotal + (item.price * item.quantity);
    });
    actualTotal = actualTotal.toFixed(2);
    net_price = net_price.toFixed(2);
    total_price = total_price.toFixed(2);
    return actualTotal == net_price || actualTotal == total_price;
}
function totalPriceAfterGSTValidator(newTotalPriceAfterGST) {
    return newTotalPriceAfterGST > this.totalPriceBeforeGST;
}
function dateOfPurchaseValidator(newDateOfPurchase) {
    let currentDate = new Date(); //currentDate will be today's date
    return newDateOfPurchase <= currentDate;
}
function imageLinkValidator(newImageLink) {
    return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(newImageLink);
}
invoiceSchema.statics.getAll = async function getAll(reqQuery) {
    if (!reqQuery.populate)
        return this.find();
    else
        return this.aggregate(invoicePipeline)
            .then(invoices => {
                invoices.forEach(invoice => {
                    convertToDollars(invoice);
                })
                return invoices;
            });
}
invoiceSchema.pre('save', function (next) {
    var invoice = this;
    invoice = convertToCents(invoice);
    next();
});
invoiceSchema.pre('findOneAndUpdate', function (next) {
    this._update = convertToCents(this._update)
    next();
})
invoiceSchema.post('findOne', function (result, next) {
    if (result)
        result = convertToDollars(result);
    next();
});

invoiceSchema.pre('find', function (next) {
    const filter = this.getQuery();
    const currencyFields = ['totalPriceBeforeGST', 'totalPriceAfterGST'];
    currencyFields.forEach(field => {
        if (filter[field]) {
            if (filter[field].$gte)
                filter[field].$gte *= 100;
            if (filter[field].$lte)
                filter[field].$lte *= 100;
        }
    });
    this.setQuery(filter);
    next();
});
invoiceSchema.post('find', function (result, next) {
    result.forEach((invoice) => {
        invoice = convertToDollars(invoice);
    });
    next();
})
invoiceSchema.post('findOne', function (result, next) {
    result = convertToDollars(result);
    next();
})
// Mongoose middleware to handle removal of invoice references
invoiceSchema.pre('remove', async function (next) {
    try {
        await StatementOfAccount.removeMissingInvoice(this._id)
    } catch (error) {
        next(error);
    }
});

function convertToDollars(invoice) {
    if (!invoice)
        return;
    if (invoice.productIDPriceQuantity)
        for (let i = 0; i < invoice.productIDPriceQuantity.length; i++) {
            invoice.productIDPriceQuantity[i].price = (parseFloat(invoice.productIDPriceQuantity[i].price) / 10000).toFixed(2)
        }
    if (invoice.totalPriceAfterGST)
        invoice.totalPriceAfterGST = (invoice.totalPriceAfterGST / 100).toFixed(2);
    if (invoice.totalPriceBeforeGST)
        invoice.totalPriceBeforeGST = (invoice.totalPriceBeforeGST / 100).toFixed(2);
    return invoice;
}
function convertToCents(invoice) {
    if (invoice.productIDPriceQuantity)
        for (let i = 0; i < invoice.productIDPriceQuantity.length; i++)
            invoice.productIDPriceQuantity[i].price = (parseFloat(invoice.productIDPriceQuantity[i].price) * 100).toFixed(2)
    if (invoice.totalPriceAfterGST)
        invoice.totalPriceAfterGST = (invoice.totalPriceAfterGST * 100).toFixed(2);
    if (invoice.totalPriceBeforeGST)
        invoice.totalPriceBeforeGST = (invoice.totalPriceBeforeGST * 100).toFixed(2);
    return invoice;
}
invoiceSchema.statics.getById = async function getById(id, reqQuery) {
    if (!reqQuery.populate)
        return this.findById(id);
    else
        return this.findById(id)
            .then((invoice) => {
                const ids = [invoice._id]
                return this.aggregate(invoiceFilterPipeline(ids))
            })
            .then(invoices => {
                invoices.forEach(invoice => {
                    convertToDollars(invoice);
                })
                return invoices;
            });
};

invoiceSchema.statics.create = async function create(reqBody) {
    var newDoc = {
        productIDPriceQuantity: reqBody.productIDPriceQuantity,
        invoiceID: reqBody.invoiceID,
        supplier: reqBody.supplier,
        dateOfPurchase: reqBody.dateOfPurchase,
        paymentType: reqBody.paymentType,
        paid: reqBody.paid,
        totalPriceBeforeGST: reqBody.totalPriceBeforeGST,
        totalPriceAfterGST: reqBody.totalPriceAfterGST,
        imageLink: reqBody.imageLink
    };
    const invoice = new this(newDoc);
    return invoice.save();
}
invoiceSchema.statics.search = async function search(reqQuery) {
    if (!reqQuery.populate) {
        const filter = getFilter(reqQuery);
        return this.find(filter).lean();
    }
    else {
        delete reqQuery.populate;
        const filter = getFilter(reqQuery);
        return this.find(filter)
            .then((invoices) => {
                const ids = invoices.map(invoice => invoice._id);
                return this.aggregate(invoiceFilterPipeline(ids))
            })
            .then(invoices => {
                invoices.forEach(invoice => {
                    convertToDollars(invoice);
                })
                return invoices;
            });
    }
}
invoiceSchema.statics.updateById = async function updateById(objectId, reqBody) {
    var newInvoice = {
        productIDPriceQuantity: reqBody.productIDPriceQuantity,
        invoiceID: reqBody.invoiceID,
        supplier: reqBody.supplier,
        dateOfPurchase: reqBody.dateOfPurchase,
        paymentType: reqBody.paymentType,
        paid: reqBody.paid,
        totalPriceBeforeGST: reqBody.totalPriceBeforeGST,
        totalPriceAfterGST: reqBody.totalPriceAfterGST,
        imageLink: reqBody.imageLink
    };
    return this.findByIdAndUpdate(objectId, newInvoice, { new: true })
}
invoiceSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId, { update: true });
}

const invoicePipeline = () => [
    {
        $unwind: {
            path: '$productIDPriceQuantity',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'products', // Replace with the name of the collection
            localField: 'productIDPriceQuantity.productID',
            foreignField: '_id',
            as: 'productData'
        }
    },
    {
        $unwind: {
            path: '$productData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplier',
            foreignField: '_id',
            as: 'supplier'
        }
    },
    {
        $unwind: {
            path: '$supplier',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$paymentsData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'paymenttypes',
            localField: 'paymentType',
            foreignField: '_id',
            as: 'paymentType'
        }
    },
    {
        $unwind: {
            path: '$paymentType',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'productIDPriceQuantity._id': '$productData._id',
            'productIDPriceQuantity.name': '$productData.name',
            'productIDPriceQuantity.upc': '$productData.upc',
            'productIDPriceQuantity.price': 1,
            'productIDPriceQuantity.quantity': 1,
            'invoiceID': 1,
            'supplier._id': 1,
            'supplier.name': 1,
            'supplier.address': 1,
            'dateOfPurchase': 1,
            'paymentType._id': 1,
            'paymentType.name': 1,
            'paid': 1,
            'totalPriceBeforeGST': 1,
            'totalPriceAfterGST': 1,
            'imageLink': 1
        }
    },
    {
        $group: {
            _id: '$_id', // Group by invoice ID
            productIDPriceQuantity: { $push: '$productIDPriceQuantity' },
            // Add other fields you want to retain here as well
            // For example:
            invoiceID: { $first: '$invoiceID' },
            supplier: { $first: '$supplier' },
            dateOfPurchase: { $first: '$dateOfPurchase' },
            paymentType: { $first: '$paymentType' },
            paid: { $first: '$paid' },
            totalPriceBeforeGST: { $first: '$totalPriceBeforeGST' },
            totalPriceAfterGST: { $first: '$totalPriceAfterGST' },
            imageLink: { $first: '$imageLink' }
        }
    },
    {
        $project: {
            '_id': 1,
            'productIDPriceQuantity': 1,
            'invoiceID': 1,
            'supplier': 1,
            'dateOfPurchase': 1,
            'paymentType': 1,
            'paid': 1,
            'totalPriceBeforeGST': 1,
            'totalPriceAfterGST': 1,
            'imageLink': 1
        }
    }
]
const invoiceFilterPipeline = (ids) => {
    const match = [{
        $match: { _id: { $in: ids } }
    }];
    const unfilteredPipeline = invoicePipeline()
    const filteredPipeline = match.concat(unfilteredPipeline);
    return filteredPipeline;
};

const Invoice = mongoose.model("invoice", invoiceSchema);
module.exports = Invoice;