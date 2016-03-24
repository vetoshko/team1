'use strict';
var mongoose = require('mongoose');
var config = require('config');
var url = config.get('db.connectionString');
var User = require('../models/users.js');
var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;
var Location = require('../models/quests.js').Location;
var Comment = require('../models/quests.js').Comment;
var CheckIn = require('../models/check-in.js');
var faker = require('faker');
var async = require('async');
var clearDB = require('mocha-mongoose')(url, {noClear: true});

const PEOPLE_COUNT = 50;

function fillUsers(userName, questName, callback) {
    new User({
        nickname: userName,
        password: faker.internet.password(),
        email: faker.internet.email(),
        questname: questName
    }).save((err, data) => {
        if (err) {
            callback(err);
        } else {
            callback();
        };
    });
};


function fillQuests(userName, questName, callback) {
    new Quest({
        name: questName,
        author: userName,
        city: faker.address.city(),
        description: faker.hacker.phrase(),
        photo: new Photo({
            quest: questName,
            filename: faker.image.avatar(),
            location: new Location({
                lat: faker.address.latitude(),
                lon: faker.address.longitude()
            }),
            comments: [ new Comment({
                author: userName,
                date: Date.now,
                text: faker.hacker.phrase()
            })]
        })
    }).save((err, data) => {
        if (err) {
            callback(err);
        } else {
            callback();
        };
    });
};

function fillCheckIn(userName, questName, callback) {
    new CheckIn({
        username: userName,
        photoname: faker.image.avatar(),
        questname: questName
    }).save((err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, true);
        };
    });
};

module.exports.fillDataBase = function (callback) {
    mongoose.connect(url);
    console.log('connect');
    module.exports.clearDB((err) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var functionsArray = [];
            for (var i = 0; i < PEOPLE_COUNT; i++) {
                var questName = faker.company.companyName();
                var userName = faker.internet.userName();
                var functionsArray = functionsArray.concat(
                    fillUsers.bind(null, userName, questName),
                    fillQuests.bind(null, userName, questName),
                    fillCheckIn.bind(null, userName, questName));
            };
            async.series(functionsArray, (err) => {
                callback(err);
                mongoose.disconnect();
            });
        }
    });
};

module.exports.clearDB = function (callback) {
    clearDB(callback);
};
