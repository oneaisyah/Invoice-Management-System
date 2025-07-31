const mongoose = require("mongoose");
const getFilter = require("../utils/filter/supplier");
const Schema = mongoose.Schema;
/*
Valid UEN with 9 digits and a letter:
123456789A

Valid UEN with 5 digits, a letter, 4 digits, and a letter:
12345A6789Z

Valid UEN with 2 digits, 'T' or 'S', 1 digit, 2 alphanumeric characters, and 4 digits followed by a letter:
08S7XY1234C
*/
const supplierSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true, default: "No address provided" },
    uen: {
        type: String, required: true, unique: true,
        validate: [uenValidator, "UEN must match one of the three formats here: https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx"]
    }

},
    {
        timestamps: true,
    });
function uenValidator(uen) {
    return /^(?:\d{9}[A-Za-z]|\d{5}[A-Za-z]\d{4}[A-Za-z]|\d{2}[TS]\d{1}[A-Za-z0-9]{2}\d{4}[A-Za-z])$/.test(uen);
}
supplierSchema.statics.getAll = async function getAll() {
    return this.find();
}
supplierSchema.statics.getById = async function getById(objectId) {
    return this.findById(objectId);
}
supplierSchema.statics.create = async function create(reqBody) {
    var newDoc = {
        name: reqBody.name,
        uen: reqBody.uen
    };
    if (reqBody.address)
        newDoc.address = reqBody.address;
    const supplier = new this(newDoc);
    return supplier.save();
}
supplierSchema.statics.search = async function search(reqQuery) {
    
    const filter = getFilter(reqQuery);
    return this.find(filter);
}
supplierSchema.statics.updateById = async function updateById(objectId, reqBody) {
    var newSupplier = {
        name: reqBody.name,
        uen: reqBody.uen
    };
    if (reqBody.address)
        newDoc.address = reqBody.address;
    return this.findByIdAndUpdate(objectId, newSupplier, { new: true });
}
supplierSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId);
}
const Supplier = mongoose.model("supplier", supplierSchema);
module.exports = Supplier;