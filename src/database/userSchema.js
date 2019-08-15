const Mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const user = new Mongoose.Schema({
    userId: {
        type: String,
        default: uuidv1()
    },
    login: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});

module.exports = user;