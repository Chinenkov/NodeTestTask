const Mongoose = require('mongoose');
const userSchema = require('./userSchema');
Mongoose.connect('mongodb://127.0.0.1:27017/node', { useNewUrlParser: true });
Mongoose.set('useCreateIndex', true);

const db = Mongoose.connection;
db.on('error', function(err) {
    console.log('Connection error', err);
    throw err;
});

db.once('open', function() {
    console.log('Connection to database success');
});

const users = Mongoose.model('user', userSchema);

module.exports = {
    users
};