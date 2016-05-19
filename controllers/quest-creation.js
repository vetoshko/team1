'use strict';
var cloudinary = require('cloudinary');
var async = require('async');
var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;
var User = require('../models/users.js');
var mongoose = require('../scripts/mongooseConnect.js');
var uploadPhoto = require('../scripts/uploadPhoto.js');

module.exports.post = (req, res) => {

    async.map(req.files, uploadPhoto.upload, (err, links) => {
        async.map(links, uploadPhoto.createPhoto, (err, photos) => {
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
