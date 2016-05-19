'use strict';
var async = require('async');
var Quest = require('../../models/quests.js').Quest;
var Photo = require('../../models/quests.js').Photo;
var Location = require('../../models/quests.js').Location;

module.exports.post = (req, res) => {
    var newPhoto = (link, hint, decription, lat, lon, callback) => {
        var photo = new Photo({
            link: link,
            hint: hint,
            description: decription,
            location: new Location({
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            })
        });
        callback(photo);
    };

    var questStages = JSON.parse(req.body.questStages);
    var questStagesModels = [];

    async.forEachOf(questStages, (value, key, callback) => {
        newPhoto(value.link, value.hint, value.description, value.lat, value.lon, (photo) => {
            questStagesModels.push(photo);
            callback();
        });
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            new Quest({
                name: req.body.name,
                author: req.user,
                city: req.body.city,
                description: req.body.description,
                photo: questStagesModels
            }).save((err, doc) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                req.user.ownedQuests.push(doc);
                req.user.save(err => {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    res.json({questId: doc['_id']});
                });
            });
        }
    });
};

module.exports.get = (req, res) => {
    res.render('new-quest/new-quest', {title: 'Express'});
};
