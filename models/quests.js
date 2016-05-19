var mongoose = require('../scripts/mongooseConnect.js');
var validators = require('mongoose-validators');
var mongoosastic = require('mongoosastic');
var esHost = require('config').get('es.host');
var esPort = require('config').get('es.port');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    checkIn: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    location: locationSchema,
    hint: String,
    description: String,
    comments: [commentSchema],
    link: {
        type: String,
        required: true
    }
});

var questSchema = new Schema({
    name: {
        type: String,
        required: true,
        es_indexed: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        es_indexed: false
    }],
    photo: {
        type: [photoSchema],
        required: true,
        es_indexed: false
    },
    comments: [commentSchema]
});

questSchema.plugin(mongoosastic, {
    host: esHost,
    port: esPort,
    // protocol: "https",
    // auth: "username:password",
    // curlDebug: true
    hydrate: true,
    hydrateOptions: {lean: true}
});

module.exports = {
    Quest: mongoose.model('Quest', questSchema),
    Photo: mongoose.model('Photo', photoSchema),
    Location: mongoose.model('Location', locationSchema),
    Comment: mongoose.model('Comment', commentSchema)
};
