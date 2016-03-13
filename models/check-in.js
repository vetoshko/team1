var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var checkInSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    photoname: {
        type: String,
        required: true
    },
    questname: {
        type: String,
        required: true
    }
});

var CheckIn = mongoose.model('Check-in', checkInSchema);

module.exports = CheckIn;
