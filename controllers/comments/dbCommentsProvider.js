'use strict';

var Quest = require('../../models/quests.js').Quest;

class DbCommentsProvider {
    getQuestById(questId, callback) {
        Quest.findById(questId)
            .populate('comments.author', 'username')
            .exec(callback);
    }

    create(questId, comment, callback) {
        Quest.findByIdAndUpdate(
            questId,
            {$push: {comments: comment}},
            callback
        );
    }

    delete(questId, commentId, user, callback) {
        Quest.findByIdAndUpdate(
            questId, {
                $pull: {
                    comments: {
                        _id: commentId,
                        author: user._id
                    }
                }
            },
            callback);
    }

    edit(questId, commentId, text, user, callback) {
        Quest.update({
                _id: questId,
                comments: {
                    $elemMatch: {
                        _id: commentId,
                        author: user._id
                    }
                }
            },
            {$set: {'comments.$.text': text}},
            callback);
    }
}


exports.DbCommentsProvider = DbCommentsProvider;
