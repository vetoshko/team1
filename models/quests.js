var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

var locationSchema = new Schema({
    lat: {
        type: Number,
        required: true,
        validate: validators.isFloat()
    },
    lon: {
        type: Number,
        required: true,
        validate: validators.isFloat()
    }
});

var photoSchema = new Schema({
    likes: Array,
    quest: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    location: locationSchema,
    hint: String,
    description: String,
    comments: [commentsSchema]
});

var questsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    like: Array,
    photo: {
        type: [photoSchema],
        required: true
    }
});

var Quests = mongoose.model('Quests', questsSchema);

module.exports = Quests;
