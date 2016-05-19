var cloudinary = require('cloudinary');
var Photo = require('../models/quests.js').Photo;
var mongoose = require('../scripts/mongooseConnect.js');

module.exports.upload = (photo, callback) => {
    cloudinary.uploader.upload(photo.path, function (result) {
        callback(null, result.url);
    });
};

module.exports.createPhoto = (link, callback) => {
    var photo = new Photo({
        link: link
    });
    callback(null, photo);
};
