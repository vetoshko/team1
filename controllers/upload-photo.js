'use strict';
var cloudinary = require('cloudinary');
var fs = require('fs');
var async = require('async');
var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;
var User = require('../models/users.js');
var mongoose = require('../scripts/mongooseConnect.js');

module.exports.post = (req, res) => {
    cloudinary.config({
        cloud_name: 'photoquest-team1',
        api_key: '643177998266659',
        api_secret: '681K4agstajtKxV3EJAcI5mUuYg'
    });

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
            var user = User.register(new User({
                _id: 1,
                username: 'admin',
                email: 'a@a.a',
                phone: '8800'
            }), 'qwertyui', err => {
                new Quest({
                    name: req.body.name,
                    author: user,
                    city: 'Ekaterinburg',
                    description: req.body.description,
                    photo: photos
                }).save(err => {
                    if (err) {
                        console.log(err);
                        mongoose.disconnect(function () {
                            console.log('All connections closed.');
                        });
                    } else {
                        mongoose.disconnect(function () {
                            console.log('All connections closed.');
                        });
                        res.redirect(`/quest/${req.body.name}`);
                    }
                });
            });
        });
    });
};





module.exports.get = (req, res) => {
    res.render('new/new', {title: 'Express'});
};
