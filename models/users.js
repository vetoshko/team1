var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    questname: String,
    email: {
        type: String,
        required: true,
        validate: validators.isEmail()
    },
    password: {
        type: String,
        required: true
    },
    phone: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
