'use strict';

var mongoose = require('./mongooseConnect.js');
var clearDB = require('./clearDB.js');
var clearES = require('./clearES.js');

var faker = require('faker');
var async = require('async');

var User = require('../models/users.js');
var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;
var Location = require('../models/quests.js').Location;
var Comment = require('../models/quests.js').Comment;

const peopleCount = 50;
const commentsMaxCount = 5;

function fillUsers(id, callback) {
    User.register(new User({
        _id: id,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumberFormat()
    }), faker.internet.password(), err => {
        err ? callback(err) : callback();
    });
}

function fillQuests(usersId, callback) {
    var size = Math.floor(1 + Math.random() * commentsMaxCount);
    var users = [];
    for (var i = 0; i < size; i++) {
        users.push(usersId[Math.floor(Math.random() * peopleCount)]);
    }

    new Quest({
        name: faker.company.companyName(),
        author: usersId[Math.floor(Math.random() * peopleCount)],
        city: faker.address.city(),
        description: faker.hacker.phrase(),
        comments: [new Comment({
            author: usersId[Math.floor(Math.random() * peopleCount)],
            date: Date.now,
            text: faker.hacker.phrase()
        })],
        photo: new Photo({
            checkIn: users,
            link: faker.image.imageUrl(),
            description: faker.hacker.phrase(),
            hint: faker.hacker.phrase(),
            location: new Location({
                lat: faker.address.latitude(),
                lon: faker.address.longitude()
            }),
            comments: [new Comment({
                author: usersId[Math.floor(Math.random() * peopleCount)],
                date: Date.now,
                text: faker.hacker.phrase()
            })]
        })
    }).save(err => {
        err ? callback(err) : callback();
    });
}

module.exports.fillDataBase = function (callback) {

    var usersId = [];
    for (var i = 0; i < peopleCount; i++) {
        usersId.push(mongoose.Types.ObjectId());
    }

    var functionsArray = [];
    for (var j = 0; j < peopleCount; j++) {
        functionsArray = functionsArray.concat(
            fillUsers.bind(null, usersId[j]),
            fillQuests.bind(null, usersId)
        );
    }

    async.parallel(functionsArray, err => {
        mongoose.disconnect(function () {
            console.log('All connections closed.');
        });
        callback(err);
    });
};

module.exports.reFillDataBase = function (callback) {
    clearDB(() => {
        clearES(() => {
            module.exports.fillDataBase(callback);
        });
    });
};

module.exports.reFillDataBase((err) => {
    err ? console.log(err) : console.log('Database filled');
});
