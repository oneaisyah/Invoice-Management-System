const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Invoice = require('./sharedUtils/InvoiceGetById');
const getFilter = require('./../utils/filter/statementOfAccount');
const statementOfAccountSchema = new Schema({
    referenceNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: referenceNumberValidator,
            message: "Reference number must only consist of alphanumeric characters and must be no more than 20 characters"
        }
    },
    invoices: {
        type: [{ type: Schema.Types.ObjectId, ref: "invoice" }],
        validate: [invoicesValidator, "All invoices must exist in the database and have the same supplier as this statement of account"]
    },
    dateIssued: {
        type: Date, required: true,
        validate: [dateIssuedValidator, "Latest possible date issued is today's date"]
    },
    dateDue: {
        type: Date, required: true,
        validator: [dateDueValidator, "Earliest possible date due has to be later than today"
        ]
    },
    supplier: { type: Schema.Types.ObjectId, ref: "supplier", required: true },
    payments: [{ type: Schema.Types.ObjectId, ref: "payment" }],
    //* https://dba.stackexchange.com/questions/15729/storing-prices-in-sqlite-what-data-type-to-use
    amountOutstanding: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    amountOverdue: { type: Number, required: true },
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

const currencyFields = ['amountOutstanding', 'amountPaid', 'amountOverdue'];

statementOfAccountSchema.pre('save', function (next) {
    var statementOfAccount = this;
    statementOfAccount = convertToCents(statementOfAccount);

    next();
})
statementOfAccountSchema.pre('find', function (next) {
    const filter = this.getQuery();
    currencyFields.forEach(field => {
        if (filter[field]) {
            if (filter[field].$gte) {
                filter[field].$gte = (filter[field].$gte * 100).toFixed(2);
            }
            if (filter[field].$lte) {
                filter[field].$lte = (filter[field].$lte * 100).toFixed(2);
            }
        }
    });
    this.setQuery(filter);
    next();
});
statementOfAccountSchema.pre('findOneAndUpdate', function (next) {
    if (this._update) {
        this._update = convertToDollars(this._update);
    }
    next();
})
statementOfAccountSchema.post('findOne', function (result, next) {

    if (result) {
        result = convertToDollars(result);
    }
    next();
});
statementOfAccountSchema.post('find', function (results, next) {

    if (results) {
        if (Array.isArray(results)) {
            results.forEach(result => {
                result = convertToDollars(result);
            })
        }
    }

    next();
});
function removeMissingInvoice(invoiceId) {
    return StatementOfAccount.updateMany(
        { invoices: invoiceId },
        { $pull: { invoices: invoiceId } }
    );
}
function convertToDollars(statementOfAccount) {
    currencyFields.forEach(field => {
        statementOfAccount[field] = (statementOfAccount[field] / 100).toFixed(2);
    });
    if (statementOfAccount.invoices) {
        statementOfAccount.invoices.forEach(invoice => {
            (invoice.totalPriceAfterGST /= 100).toFixed(2);
        })
    }
    return statementOfAccount;
}
function convertToCents(statementOfAccount) {
    currencyFields.forEach(field => {
        statementOfAccount[field] = (statementOfAccount[field] * 100).toFixed(2);
    });
    return statementOfAccount;
}
function dateIssuedValidator(dateIssued) {
    let currentDate = new Date(); //currentDate will be today's date
    return dateIssued <= currentDate;
}
function dateDueValidator(dateDue) {
    return dateDue > this.dateIssued;
}
async function invoicesValidator(invoices) {
    try {
        let previousSupplier = null;
        for (let i = 0; i < invoices.length; i++) {
            const id = invoices[i];
            const invoice = await this.model('invoice').findById(id);
            // reject if invoice with this id does not exist
            if (invoice === null)
                return false;
            const currentSupplier = invoice.supplier;
            //reject if current invoice's supplier is different from soa supplier field
            if (!currentSupplier.equals(this.supplier)) {
                return false;
            }
            if (i === 0) {
                previousSupplier = currentSupplier;
            }
            else {
                //reject if one invoice is different from the rest
                if (!previousSupplier.equals(currentSupplier))
                    return false;
            }
        }
        return true;
    } catch (err) {
        throw err;
    }
}
function referenceNumberValidator(referenceNumber) {
    return /^[A-Za-z0-9]+$/.test(referenceNumber);
}
function imageLinkValidator(newImageLink) {
    return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(newImageLink);
}

statementOfAccountSchema.statics.getById = async function getById(id, reqQuery) {
    if (!reqQuery.populate)
        return this.findById(id);
    else
        return this.findById(id)
            .then((statementOfAccount) => {
                const ids = [statementOfAccount._id]
                return aggregate(statementOfAccountFilterPipeline(ids))
            })
            .then(statementOfAccounts => {
                statementOfAccounts.forEach(statementOfAccount => {
                    convertToDollars(statementOfAccount);
                })
                return statementOfAccounts;
            });
}
statementOfAccountSchema.statics.create = async function create(reqBody) {
    const newDoc = {
        referenceNumber: reqBody.referenceNumber,
        invoices: reqBody.invoices,
        payments: reqBody.payments,
        dateIssued: new Date(reqBody.dateIssued),
        dateDue: new Date(reqBody.dateDue),
        supplier: reqBody.supplier,
        amountOutstanding: reqBody.amountOutstanding,
        amountPaid: reqBody.amountPaid,
        amountOverdue: reqBody.amountOverdue,
        imageLink: reqBody.imageLink
    }
    const statementOfAccount = new this(newDoc);
    return statementOfAccount.save();
}
statementOfAccountSchema.statics.search = async function search(reqQuery) {
    if (!reqQuery.populate) {
        const filter = getFilter(reqQuery);
        return this.find(filter).lean();
    }
    else {
        delete reqQuery.populate;
        const filter = getFilter(reqQuery);
        return this.find(filter)
            .then((statementOfAccounts) => {
                const ids = statementOfAccounts.map(statementOfAccount => statementOfAccount._id);
                return this.aggregate(statementOfAccountFilterPipeline(ids))
            })
            .then(statementOfAccounts => {
                statementOfAccounts.forEach(statementOfAccount => {
                    convertToDollars(statementOfAccount);
                });
                return statementOfAccounts;
            });
    }
}
statementOfAccountSchema.statics.updateById = async function updateById(objectId, reqBody) {
    const newStatementOfAccount = {
        referenceNumber: reqBody.referenceNumber,
        invoices: reqBody.invoices,
        payments: reqBody.payments,
        dateDue: new Date(reqBody.dateDue),
        dateIssued: new Date(reqBody.dateIssued),
        supplier: reqBody.supplier,
        amountOutstanding: reqBody.amountOutstanding,
        amountPaid: reqBody.amountPaid,
        amountOverdue: reqBody.amountOverdue,
        imageLink: reqBody.imageLink
    }
    return this.findByIdAndUpdate(objectId, newStatementOfAccount, { new: true });
}

statementOfAccountSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId, { update: true });
}
statementOfAccountSchema.statics.removeMissingInvoice = removeMissingInvoice;
const statementOfAccountPipeline = () => [

    {
        $lookup: {
            from: 'invoices', // Replace with the actual name of the "Invoice" collection
            localField: 'invoices',
            foreignField: '_id',
            as: 'invoicesData',
        },
    },
    {
        $lookup: {
            from: 'payments', // Replace with the name of the "Payment" collection
            localField: 'payments',
            foreignField: '_id',
            as: 'paymentsData'
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplier',
            foreignField: '_id',
            as: 'supplierData'
        }
    },
    {
        $unwind: {
            path: '$supplierData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'referenceNumber': 1,
            invoices: {
                $map: {
                    input: '$invoicesData',
                    as: 'invoiceData',
                    in: {
                        _id: '$$invoiceData._id',
                        invoiceID: '$$invoiceData.invoiceID',
                        dateOfPurchase: '$$invoiceData.dateOfPurchase',
                        totalPriceAfterGST: '$$invoiceData.totalPriceAfterGST',
                    },
                },
            },
            'dateIssued': 1,
            'dateDue': 1,
            'supplier._id': '$supplierData._id',
            'supplier.name': '$supplierData.name',
            'supplier.uen': '$supplierData.uen',
            payments: {
                $map: {
                    input: '$paymentsData',
                    as: 'paymentData',
                    in: {
                        referenceNumber: '$$paymentData.referenceNumber',
                        dateOfPayment: '$$paymentData.dateOfPayment',
                        amount: '$$paymentData.amount',
                        recipientName: '$$paymentData.recipientName'
                    },
                },
            },
            'amountOutstanding': 1,
            'amountPaid': 1,
            'amountOverdue': 1
        }
    },
    {
        $group: {
            _id: '$_id',
            referenceNumber: { $first: '$referenceNumber' },
            dateIssued: { $first: '$dateIssued' },
            dateDue: { $first: '$dateDue' },
            supplier: { $first: '$supplier' },
            amountOutstanding: { $first: '$amountOutstanding' },
            amountPaid: { $first: '$amountPaid' },
            amountOverdue: { $first: '$amountOverdue' },
            invoices: { $first: '$invoices' }, // Use $addToSet to avoid duplicates
            payments: { $first: '$payments' }
        }
    },
];
const statementOfAccountFilterPipeline = (ids) => {
    const match = [{
        $match: { _id: { $in: ids } }
    }];
    const unfilteredPipeline = statementOfAccountPipeline()
    //attach a 
    const filteredPipeline = match.concat(unfilteredPipeline);
    return filteredPipeline;
};



const StatementOfAccount = mongoose.model("StatementOfAccount", statementOfAccountSchema);
module.exports = StatementOfAccount;