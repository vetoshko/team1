var Quest = require('../models/quests.js');

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

module.exports = (user, questId) =>
    new Promise((resolve, reject) => {
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
        }

        getQuest(questId, (err, quest) => {
            if (err) {
                return reject(err);
            }
            resolve(user._id.equals(quest.author._id) ? 'author' : 'none');
        });
    });
