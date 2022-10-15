const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,
    roles: {
        type: Array,
        default: "1000"
    }
});

module.exports = mongoose.model('User', userSchema);