'use strict';

var User = require('../models/users.js');

module.exports.startQuest = (userId, questId, callback) => {
    User.findByIdAndUpdate(
        userId, {
            $push: {
                startedQuests: questId
            }
        },
        (err, data) => {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
};
