const mongoose = require("mongoose");
const getFilter = require("../utils/filter/product");
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: { type: String, required: true },
    upc: {
        type: String,
        validate: [upcValidator, "upc must be 12 or 13 digits"],
        index: { unique: true, sparse: true }
    }
},
    {
        timestamps: true,
    });
function upcValidator(upc) {
    return /^(\d{12}|(\d{13}))$/.test(upc);
}
productSchema.statics.getAll = async function getAll() {
    return this.find();
}
productSchema.statics.getById = async function getById(objectId) {
    return this.findById(objectId);
}
productSchema.statics.search = async function search(reqQuery) {
    const filter = getFilter(reqQuery)
    return this.find(filter).lean();
}
productSchema.statics.create = async function create(reqBody) {
    var newDoc = {
        name: reqBody.name,
    };
    if (reqBody.hasOwnProperty('upc'))
        newDoc.upc = reqBody.upc;
    const product = new this(newDoc);
    return product.save()
}
productSchema.statics.updateById = async function updateById(objectId, reqBody) {
    var newProduct = {
        name: reqBody.name,
    };
    if (reqBody.hasOwnProperty('upc'))
        newProduct.upc = reqBody.upc;
    return this.findByIdAndUpdate(objectId, newProduct, { new: true });
}
productSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId);
}
const Product = mongoose.model("product", productSchema);
module.exports = Product;
