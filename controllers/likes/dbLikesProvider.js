'use strict';

var Quest = require('../../models/quests.js').Quest;
var Photo = require('../../models/quests.js').Photo;

class DbLikesProvider {
    likeQuest(questId, userId, callback) {
        Quest.findByIdAndUpdate(
            questId,
            {$push: {likes: userId}},
            callback
        );
    }

    dislikeQuest(questId, userId, callback) {

        Quest.findByIdAndUpdate(
            questId, {
                $pullAll: {
                    likes: [userId]
                }
            },
            callback);
    }

    likePhoto(photoId, userId, callback) {
        Photo.findByIdAndUpdate(
            photoId,
            {$push: {likes: userId}},
            callback
        );
    }

    dislikePhoto(photoId, userId, callback) {
        Photo.findByIdAndUpdate(
            photoId, {
                $pullAll: {
                    likes: [userId]
                }
            },
            callback);
    }
}


exports.DbLikesProvider = DbLikesProvider;
