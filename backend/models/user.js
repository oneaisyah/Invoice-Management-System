const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleLevel: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0,
        required: true
    }
})

userSchema.statics.getAll = async function getAll() { 
    try {
        const query = this.find();
    
        query.select('-password -__v');
    
        const result = await query.exec();
        return result;
    } catch (error) {
    throw error;
    }
}
userSchema.statics.search = async function search(filter) {
    
    const query = this.find(filter);
    
    query.select('-password -__v').lean();

    const result = await query.exec();

    return result
}
userSchema.statics.searchByUsername = async function searchByUsername(username) {
    
    const query = this.find(username);
    
    query.select('-password -__v');

    const result = await query.exec();

    return result
}
userSchema.statics.updateByName = async function updateByName(currentUsername, documentIDToEdit, reqBody) {

    const filter = {_id: documentIDToEdit};

    let newUser = {
        username: reqBody.username,
        password: reqBody.password,
        roleLevel: reqBody.roleLevel
    };
    
    return await this.findOneAndUpdate(filter, newUser, { new: true });
}

userSchema.statics.create = async function create(reqBody) {

    
    var newUser = {
        username: reqBody.username,
        password: reqBody.password,
        roleLevel: reqBody.roleLevel
    };

    const user = new this(newUser);

    return user.save();
}

userSchema.statics.deleteById = async function deleteById(objectId) {
    return this.findByIdAndDelete(objectId);
}

userSchema.methods.checkPassword = async function checkPassword(candidatePassword, callback) {
    const user = await this.model('User').findOne({username: this.username})


    if (!user) {
        return callback(null, false);
    }
    bcrypt.compare(candidatePassword, user.password, function(err, res) {

        if (err) {
            callback(err)
        } else if (res) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    });
}

const User = mongoose.model('User', userSchema)
module.exports = User;