const mongoose = require("mongoose");
const getFilter = require("../utils/filter/paymentType");
const Schema = mongoose.Schema;
const paymentTypeSchema = new Schema({
    name: { type: String, required: true },
},
    {
        timestamps: true,
    });
paymentTypeSchema.statics.getAll = async function getAll() {

    return this.find();
}
paymentTypeSchema.statics.getById = async function getById(objectId) {
    return this.findById(objectId);
}
paymentTypeSchema.statics.search = async function search(reqQuery) {
    const filter = getFilter(reqQuery)
    return this.find(filter).lean();
}
paymentTypeSchema.statics.create = async function create(reqBody) {
    const newDoc = {
        name: reqBody.name
    };
    const paymentType = new this(newDoc);
    return paymentType.save();
}
paymentTypeSchema.statics.updateById = async function updateById(objectId, reqBody) {
    const newPaymentType = {
        name: reqBody.name
    };
    return this.findByIdAndUpdate(objectId, newPaymentType, { new: true });
}
paymentTypeSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId);
}
const PaymentType = mongoose.model("paymentType", paymentTypeSchema);
module.exports = PaymentType;