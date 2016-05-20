'use strict';

var questsModel = require('../../models/quests.js');
var Comment = questsModel.Comment;


class CommentsController {
    constructor(commentsProvider) {
        this.commentsProvider = commentsProvider;
    }

    list(req, res) {
        var questId = req.params.questId;
        this.commentsProvider.getQuestById(questId, (err, quest) => {
            if (err) {
                return res.status(500).send();
            }
            if (!quest) {
                return res.status(400).send();
            }
            res.json({comments: quest.comments});
        });
    }

    create(req, res) {
        var questId = req.params.questId;
        var text = req.body.text;
        var comment = new Comment({
            author: req.user,
            text
        });
        this.commentsProvider.create(questId, comment, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            comment.populate({
                path: 'author',
                select: 'username'
            }, (err, comment) => {
                res.status(201);
                res.json({comment});
            });
        });
    }

    delete(req, res) {
        var questId = req.params.questId;
        var commentId = req.body.commentId;
        this.commentsProvider.delete(questId, commentId, req.user, (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.status(200).send();
        });
    }

    edit(req, res) {
        var questId = req.params.questId;
        var commentId = req.body.commentId;
        var text = req.body.text;
        this.commentsProvider.edit(questId, commentId, text, req.user, (err, updated) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(updated.n ? 200 : 400).send();
        });
    }
}

exports.CommentsController = CommentsController;
