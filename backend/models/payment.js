const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getFilter = require('.././utils/filter/payment');
const paymentSchema = new Schema({
    amount: { type: Number, required: true },
    type: { type: Schema.Types.ObjectId, ref: "paymentType" },
    dateOfPayment: { type: Date, required: true },
    referenceNumber: { type: String, required: true, unique: true },
    recipientName: { type: String, required: true }
},
    {
        timestamps: true
    });
paymentSchema.statics.getAll = async function getById(reqQuery) {
    if (!reqQuery.populate)
        return this.find();
    else
        return this.aggregate(paymentPipeline({}));
}
paymentSchema.statics.getById = async function getById(id, reqQuery) {
    if (!reqQuery.populate) {
        return this.findById(id);
    } else
        return this.aggregate(paymentPipeline({ _id: id }));
}
paymentSchema.statics.search = async function search(reqQuery) {
    if (!reqQuery.populate) {
        const filter = getFilter(reqQuery);
        return this.find(filter).lean();
    }
    else {
        delete reqQuery.populate;
        const filter = getFilter(reqQuery)
        return this.aggregate(paymentPipeline(filter))
    }
}
paymentSchema.statics.create = async function create(reqBody) {
    const newDoc = {
        amount: reqBody.amount,
        type: reqBody.type,
        dateOfPayment: reqBody.dateOfPayment,
        recipientName: reqBody.recipientName,
        referenceNumber: reqBody.referenceNumber
    }
    const payment = new this(newDoc);
    return payment.save();
}
paymentSchema.statics.updateById = async function updateById(objectId, reqBody) {
    const newPayment = {
        amount: reqBody.amount,
        type: reqBody.type,
        dateOfPayment: reqBody.dateOfPayment,
        recipientName: reqBody.recipientName,
        referenceNumber: reqBody.referenceNumber
    }
    return this.findByIdAndUpdate(objectId, newPayment, { new: true });
}
paymentSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId);
}
const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;

const paymentPipeline = (filter) => [
    {
        $match: filter
    },
    {
        $unwind: {
            path: '$type',
            preserveNullAndEmptyArrays: true // This is necessary:
            // When you perform the $unwind stage on an empty array, 
            // it results in an empty pipeline, and the subsequent 
            // $lookup stage will not be able to find any matches, leading to an empty result.
        }
    },
    {
        $lookup: {
            from: 'paymenttypes', // Replace with the name of the collection
            localField: 'type',
            foreignField: '_id',
            as: 'paymentTypesData'
        }
    },
    {
        $unwind: {
            path: '$paymentTypesData',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            '_id': 1,
            'amount': 1,
            'type._id': '$paymentTypesData._id',
            'type.name': '$paymentTypesData.name',
            'dateOfPayment': 1,
            'referenceNumber': 1,
            'recipientName': 1,
        }
    }
];
