var mongoose = require('../scripts/mongooseConnect.js');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: validators.isEmail()
    },
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    startedQuests: [{
        type: Schema.Types.ObjectId,
        ref: 'Quest',
        es_indexed: false
    }]
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

module.exports = User;

