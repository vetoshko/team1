'use strict';

var Quest = require('../models/quests.js').Quest;
var Photo = require('../models/quests.js').Photo;

function getQuest(questId, callback) {
    Quest.findById(questId, (err, quest) => {
        if (err) {
            return callback(err);
        }
        if (!quest) {
            return callback(new Error('Incorect questId: ' + questId));
        }
        callback(null, quest);
    });
}

function isQuestCompleted(userId, quest) {
    for (let i = 0; i < quest.photo.length; i++) {
        if (quest.photo[i].checkIn.findIndex(id => id.equals(userId)) < 0) {
            return false;
        }
    }
    return true;
}

module.exports.getUserRole = (user, questId) => {
    return new Promise((resolve, reject) => {
        if (!user || !questId) {
            return resolve('none');
        }

        if (user.startedQuests.findIndex(id => id.equals(questId)) >= 0) {
            getQuest(questId, (err, quest) => {
                if (err) {
                    return reject(err);
                }
                return resolve(isQuestCompleted(user._id, quest) ? 'completed' : 'started');
            });
            return;
        } else {
            return resolve('notStarted');
        }

        getQuest(questId, (err, quest) => {
            if (err) {
                return reject(err);
            }
            resolve(user._id.equals(quest.author._id) ? 'author' : 'none');
        });
    });
};

module.exports.isPhotosChecked = (userId, questId) => {
    return new Promise((resolve, reject) => {
        var isChecked = {};
        if (!userId || !questId) {
            return reject('none');
        }
        getQuest(questId, (err, quest) => {
            if (err) {
                return reject(err);
            }
            var photos = quest.photo;
            photos.forEach((currentPhoto, index, photos) => {
                if (currentPhoto.checkIn.findIndex(checkin => checkin.equals(userId)) !== -1) {
                    isChecked[currentPhoto._id] = true;
                } else {
                    isChecked[currentPhoto._id] = false;
                }
            });
            return resolve(isChecked);
        });
    });
};
