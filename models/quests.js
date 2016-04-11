var mongoose = require('../scripts/mongooseConnect.js');
var validators = require('mongoose-validators');
var mongoosastic = require('mongoosastic');
var esHost = require('config').get('es.host');
var esPort = require('config').get('es.port');
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
        required: true,
        es_indexed: true
    },
    author: {
        type: String,
        required: true,
        es_indexed: true
    },
    city: {
        type: String,
        required: true,
        es_indexed: true
    },
    description: {
        type: String,
        required: true,
        es_indexed: true
    },
    like: {
        type: Array,
        es_indexed: false
    },
    photo: {
        type: [photoSchema],
        required: true,
        es_indexed: false
    }
});

questsSchema.plugin(mongoosastic, {
    host: esHost,
    port: esPort
    // protocol: "https",
    // auth: "username:password",
    // curlDebug: true
});

var Quest = mongoose.model('Quests', questsSchema);

module.exports = {
    Quest: Quest,
    Photo: mongoose.model('Photos', photoSchema),
    Location: mongoose.model('Locations', locationSchema),
    Comment: mongoose.model('Comments', commentsSchema)
};
