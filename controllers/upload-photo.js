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

    async.map(req.files, uploadFunction, (err, links) => {
        async.map(links, newPhoto, (err, photos) => {
            new Quest({
                name: req.body.name,
                author: req.user,
                city: 'Ekaterinburg',
                description: req.body.description,
                photo: photos
            }).save(err => {
                if (!err) {
                    res.redirect(`/quest/${req.body.name}`);
                } else {
                    res.sendStatus(400);
                }
            });
        });
    });
};

module.exports.get = (req, res) => {
    res.render('new-quest/new-quest', {title: 'Express'});
};
