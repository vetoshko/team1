'use strict';
var cloudinary = require('cloudinary');
var fs = require('fs');
var async = require('async');
var Photo = require('../../models/quests.js').Photo;

module.exports.post = (req, res) => {
    console.log(req.files);

    cloudinary.config(require('config').get('cloudinary'));
    var uploadFunction = (photo, callback) => {
        cloudinary.uploader.upload(photo.path, function (result) {
            // Парсим информацию про местоположение
            fs.readFile(photo.path, function read(err, data) {
                if (err) {
                    console.log(err);
                }

                var geo = {lat: null, lon: null};
                var parsedData;
                try {
                    var parser = require('exif-parser').create(data);
                    parsedData = parser.parse();
                    if (parsedData.tags) {
                        geo.lat = parsedData.tags.GPSLatitude;
                        geo.lon = parsedData.tags.GPSLongitude;
                    }
                } catch (err) {
                    console.log('Not a jpg');
                }

                callback(null, {url: result.url, geo: geo});
            });
        });
    };

    async.map(req.files, uploadFunction, (err, links) => {
        res.json(links);
    });
};
