'use strict';
var cloudinary = require('cloudinary');
var fs = require('fs');
var async = require('async');
var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;
var User = require('../models/users.js');
var mongoose = require('../scripts/mongooseConnect.js');

module.exports.post = (req, res) => {
    cloudinary.config(require('config').get('cloudinary'));

    var uploadFunction = (photo, callback) => {
        cloudinary.uploader.upload(photo.path, function (result) {
            callback(null, result.url);
        });
    };

    var newPhoto = (link, callback) => {
        var photo = new Photo({
            link: link
        });
        callback(null, photo);
    };
};





module.exports.get = (req, res) => {
    res.render('new/new', {title: 'Express'});
};
