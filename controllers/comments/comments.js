var questsModel = require('../../models/quests.js');
var Quest = questsModel.Quest;
var Comment = questsModel.Comment;

module.exports.list = function (req, res) {
    var questId = req.params.questId;
    Quest.findById(questId)
        .populate('comments.author', 'username')
        .exec((err, quest) => {
            if (err) {
                return res.status(500).send();
            }
            if (!quest) {
                return res.status(400).send();
            }
            res.json({comments: quest.comments});
        });
};

module.exports.create = function (req, res) {
    var questId = req.params.questId;
    var text = req.body.text;
    var comment = new Comment({
        author: req.user,
        text
    });
    Quest.findByIdAndUpdate(
        questId,
        {$push: {comments: comment}},
        (err, updatedDoc) => {
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
        }
    );
};

module.exports.delete = function (req, res) {
    var questId = req.params.questId;
    var commentId = req.body.commentId;

    Quest.findByIdAndUpdate(
        questId, {
            $pull: {
                comments: {
                    _id: commentId,
                    author: req.user._id
                }
            }
        },
        (err, updatedDoc) => {
            if (err) {
                return res.status(500).send();
            }
            if (!updatedDoc) {
                return res.status(400).send();
            }
            res.status(200).send();
        }
    );
};

module.exports.edit = function (req, res) {
    var questId = req.params.questId;
    var commentId = req.body.commentId;
    var text = req.body.text;

    Quest.update({
            _id: questId,
            comments: {
                $elemMatch: {
                    _id: commentId,
                    author: req.user._id
                }
            }
        },
        {$set: {'comments.$.text': text}},
        (err, updated) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(updated.n ? 200 : 400).send();
        }
    );
};

